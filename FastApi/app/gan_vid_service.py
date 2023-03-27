import os, sys, yaml, matplotlib, imageio, torch
import shutil

import cv2
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
from torch.autograd import Variable
from PIL import Image
from argparse import ArgumentParser
from tqdm import tqdm
import numpy as np
from skimage.transform import resize
from skimage import img_as_ubyte
from scipy.spatial import ConvexHull
import gc
import face_alignment

from .cycle_gan.datasets import ImageDataset
from .cycle_gan.model import GeneratorResNet
from .face_vid.replicate import DataParallelWithCallback
from .face_vid.generator import OcclusionAwareSPADEGenerator
from .face_vid.keypoint_detector import KPDetector, HEEstimator
from .face_vid.animate import normalize_kp
from .face_vid.face_extractor import face_extractor

matplotlib.use('Agg')



def get_image_size(img, key):
    global value
    img2 = Image.open(img)
    w = img2.width
    h = img2.height
    if key == 'h':
        value = h
    elif key == 'w':
        value = w
    return value

def define_tensor(img):
    Tensor = torch.Tensor
    input_nc = 3
    batch_size = 1
    input_A = Tensor(batch_size, input_nc, get_image_size(img, 'h'), get_image_size(img, 'w'))
    return input_A

def define_dataload(img):
    transforms_ = [transforms.ToTensor(), transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))]
    dataloader = DataLoader(ImageDataset(img, transforms_=transforms_, mode='test'),batch_size=1, shuffle=False, num_workers=0)
    return dataloader

def create_repository():
    if not os.path.exists('result_gan_vid'):
        os.makedirs('result_gan_vid')

def create_fake_image(img):
    create_repository()
    img_height = get_image_size(img, 'h')
    img_width = get_image_size(img, 'w')
    print('입력된 이미지 세로 사이즈 (pix) :', img_height)
    print('입력된 이미지 가로 사이즈 (pix) :', img_width)
    channels = 3
    input_shape = (channels, img_height, img_width)
    n_residual_blocks = 9
    G_AB = GeneratorResNet(input_shape, n_residual_blocks)
    G_AB.to('cpu')

    checkpoint_G_AB = torch.load("app/cycle_gan/pth/G_AB_6.pth.tar", map_location=torch.device('cpu'))
    G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
    G_AB.eval()

    for i, batch in enumerate(define_dataload(img)):
        real_A = Variable(define_tensor(img).copy_(batch))
        fake_B = 0.5 * (G_AB(real_A).data + 1.0)

        file_name = img[img.rfind('/') + 1:] # images 경로의 마지막 파일명만 가져오기

        save_image(fake_B, "result_gan_vid/fake_%s" % file_name)
        img = imageio.v2.imread("result_gan_vid/fake_%s" % file_name)
        return img

def load_checkpoints(config_path, checkpoint_path, cpu=False):
    with open(config_path) as f:
        config = yaml.load(f, Loader=yaml.SafeLoader)

    generator = OcclusionAwareSPADEGenerator(**config['model_params']['generator_params'], **config['model_params']['common_params'])

    if not cpu:
        generator.to('cpu')

    kp_detector = KPDetector(**config['model_params']['kp_detector_params'], **config['model_params']['common_params'])

    if not cpu:
        kp_detector.to('cpu')

    he_estimator = HEEstimator(**config['model_params']['he_estimator_params'], **config['model_params']['common_params'])
    if not cpu:
        he_estimator.to('cpu')

    if cpu:
        checkpoint = torch.load(checkpoint_path, map_location=torch.device('cpu'))
    else:
        checkpoint = torch.load(checkpoint_path, map_location=torch.device('cpu'))

    generator.load_state_dict(checkpoint['generator'])
    kp_detector.load_state_dict(checkpoint['kp_detector'])
    he_estimator.load_state_dict(checkpoint['he_estimator'])

    if not cpu:
        generator = DataParallelWithCallback(generator)
        kp_detector = DataParallelWithCallback(kp_detector)
        he_estimator = DataParallelWithCallback(he_estimator)

    generator.eval()
    kp_detector.eval()
    he_estimator.eval()

    return generator, kp_detector, he_estimator

def headpose_pred_to_degree(pred):
    device = pred.device
    idx_tensor = [idx for idx in range(66)]
    idx_tensor = torch.FloatTensor(idx_tensor).to(device)
    pred = torch.softmax(pred, dim=1)
    degree = torch.sum(pred * idx_tensor, axis=1) * 3 - 99

    return degree

def get_rotation_matrix(yaw, pitch, roll):
    yaw = yaw / 180 * 3.14
    pitch = pitch / 180 * 3.14
    roll = roll / 180 * 3.14

    roll = roll.unsqueeze(1)
    pitch = pitch.unsqueeze(1)
    yaw = yaw.unsqueeze(1)

    pitch_mat = torch.cat([torch.ones_like(pitch), torch.zeros_like(pitch), torch.zeros_like(pitch),
                           torch.zeros_like(pitch), torch.cos(pitch), -torch.sin(pitch),
                           torch.zeros_like(pitch), torch.sin(pitch), torch.cos(pitch)], dim=1)
    pitch_mat = pitch_mat.view(pitch_mat.shape[0], 3, 3)

    yaw_mat = torch.cat([torch.cos(yaw), torch.zeros_like(yaw), torch.sin(yaw),
                         torch.zeros_like(yaw), torch.ones_like(yaw), torch.zeros_like(yaw),
                         -torch.sin(yaw), torch.zeros_like(yaw), torch.cos(yaw)], dim=1)
    yaw_mat = yaw_mat.view(yaw_mat.shape[0], 3, 3)

    roll_mat = torch.cat([torch.cos(roll), -torch.sin(roll), torch.zeros_like(roll),
                          torch.sin(roll), torch.cos(roll), torch.zeros_like(roll),
                          torch.zeros_like(roll), torch.zeros_like(roll), torch.ones_like(roll)], dim=1)
    roll_mat = roll_mat.view(roll_mat.shape[0], 3, 3)

    rot_mat = torch.einsum('bij,bjk,bkm->bim', pitch_mat, yaw_mat, roll_mat)

    return rot_mat

def keypoint_transformation(kp_canonical, he, estimate_jacobian=True, free_view=False, yaw=0, pitch=0, roll=0):
    kp = kp_canonical['value']
    if not free_view:
        yaw, pitch, roll = he['yaw'], he['pitch'], he['roll']
        yaw = headpose_pred_to_degree(yaw)
        pitch = headpose_pred_to_degree(pitch)
        roll = headpose_pred_to_degree(roll)
    else:
        if yaw is not None:
            yaw = torch.tensor([yaw]).to('cpu')
        else:
            yaw = he['yaw']
            yaw = headpose_pred_to_degree(yaw)
        if pitch is not None:
            pitch = torch.tensor([pitch]).to('cpu')
        else:
            pitch = he['pitch']
            pitch = headpose_pred_to_degree(pitch)
        if roll is not None:
            roll = torch.tensor([roll]).to('cpu')
        else:
            roll = he['roll']
            roll = headpose_pred_to_degree(roll)

    t, exp = he['t'], he['exp']

    rot_mat = get_rotation_matrix(yaw, pitch, roll)

    kp_rotated = torch.einsum('bmp,bkp->bkm', rot_mat, kp)

    t = t.unsqueeze_(1).repeat(1, kp.shape[1], 1)
    kp_t = kp_rotated + t

    exp = exp.view(exp.shape[0], -1, 3)
    kp_transformed = kp_t + exp

    if estimate_jacobian:
        jacobian = kp_canonical['jacobian']
        jacobian_transformed = torch.einsum('bmp,bkps->bkms', rot_mat, jacobian)
    else:
        jacobian_transformed = None

    return {'value': kp_transformed, 'jacobian': jacobian_transformed}

def make_animation(source_image, driving_video, generator, kp_detector, he_estimator, relative=True,
                   adapt_movement_scale=True, estimate_jacobian=True, cpu=False, free_view=False, yaw=0, pitch=0,
                   roll=0):
    with torch.no_grad():
        predictions = []
        source = torch.tensor(source_image[np.newaxis].astype(np.float32)).permute(0, 3, 1, 2)
        if not cpu:
            source = source.to('cpu')
        driving = torch.tensor(np.array(driving_video)[np.newaxis].astype(np.float32)).permute(0, 4, 1, 2, 3)
        kp_canonical = kp_detector(source)
        he_source = he_estimator(source)
        he_driving_initial = he_estimator(driving[:, :, 0])

        kp_source = keypoint_transformation(kp_canonical, he_source, estimate_jacobian)
        kp_driving_initial = keypoint_transformation(kp_canonical, he_driving_initial, estimate_jacobian)

        for frame_idx in tqdm(range(driving.shape[2])):
            driving_frame = driving[:, :, frame_idx]
            if not cpu:
                driving_frame = driving_frame.to('cpu')
            he_driving = he_estimator(driving_frame)
            kp_driving = keypoint_transformation(kp_canonical, he_driving, estimate_jacobian, free_view=free_view,
                                                 yaw=yaw, pitch=pitch, roll=roll)
            kp_norm = normalize_kp(kp_source=kp_source, kp_driving=kp_driving,
                                   kp_driving_initial=kp_driving_initial, use_relative_movement=relative,
                                   use_relative_jacobian=estimate_jacobian, adapt_movement_scale=adapt_movement_scale)
            out = generator(source, kp_source=kp_source, kp_driving=kp_norm)

            predictions.append(np.transpose(out['prediction'].data.cpu().numpy(), [0, 2, 3, 1])[0])
    return predictions

def find_best_frame(source, driving, cpu=False):


    def normalize_kp(kp):
        kp = kp - kp.mean(axis=0, keepdims=True)
        area = ConvexHull(kp[:, :2]).volume
        area = np.sqrt(area)
        kp[:, :2] = kp[:, :2] / area
        return kp

    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType._2D, flip_input=True,
                                      device='cpu' if cpu else 'cpu')
    kp_source = fa.get_landmarks(255 * source)[0]
    kp_source = normalize_kp(kp_source)
    norm = float('inf')
    frame_num = 0
    for i, image in tqdm(enumerate(driving)):
        kp_driving = fa.get_landmarks(255 * image)[0]
        kp_driving = normalize_kp(kp_driving)
        new_norm = (np.abs(kp_source - kp_driving) ** 2).sum()
        if new_norm < norm:
            norm = new_norm
            frame_num = i
    return frame_num

# def face_vid_parser():
#     parser = ArgumentParser()
#     # parser.add_argument("--config", default='app/face_vid/vox-256.yaml', help="path to config")
#     parser.add_argument("--checkpoint", default='app/face_vid/pth/00000189-checkpoint.pth.tar',
#                         help="path to checkpoint to restore")
#
#     # parser.add_argument("--driving_video", default='app/face_vid/video_sauce/15.mp4', help="path to driving video")
#
#     parser.add_argument("--relative", dest="relative", action="store_true",
#                         help="use relative or absolute keypoint coordinates")
#     parser.add_argument("--adapt_scale", dest="adapt_scale", action="store_true",
#                         help="adapt movement scale based on convex hull of keypoints")
#
#     parser.add_argument("--find_best_frame", dest="find_best_frame", action="store_true",
#                         help="Generate from the frame that is the most alligned with source. (Only for faces, requires face_aligment lib)")
#
#     parser.add_argument("--best_frame", dest="best_frame", type=int, default=None,
#                         help="Set frame to start from.")
#
#     # parser.add_argument("--cpu", dest="cpu", action="store_true", help="cpu mode.")
#
#     parser.add_argument("--free_view", dest="free_view", action="store_true", help="control head pose")
#     parser.add_argument("--yaw", dest="yaw", type=int, default=None, help="yaw")
#     parser.add_argument("--pitch", dest="pitch", type=int, default=None, help="pitch")
#     parser.add_argument("--roll", dest="roll", type=int, default=None, help="roll")
#
#     parser.set_defaults(relative=False)
#     parser.set_defaults(adapt_scale=False)
#     parser.set_defaults(free_view=False)
#
#     opt = parser.parse_args()
#     return opt

def create_fake_img_and_vid(img):
    create_repository()
    file_name = img[img.rfind('/') + 1:]

    img = face_extractor(img) # 추출된 이미지는 512px
    img = create_fake_image(img)

    # opt = face_vid_parser()

    source_image = img
    reader = imageio.get_reader('app/face_vid/video_sauce/15.mp4')
    fps = reader.get_meta_data()['fps']
    driving_video = []
    try:
        for im in reader:
            driving_video.append(im)
    except RuntimeError:
        pass
    reader.close()

    source_image = resize(source_image, (256, 256))[..., :3] # 512 이미지를 리사이즈 하여 input
    driving_video = [resize(frame, (256, 256))[..., :3] for frame in driving_video]
    generator, kp_detector, he_estimator = load_checkpoints(config_path='app/face_vid/vox-256.yaml',
                                                            checkpoint_path='app/face_vid/pth/00000189-checkpoint.pth.tar',
                                                            cpu='store_true')

    with open('app/face_vid/vox-256.yaml') as f:
        config = yaml.load(f, Loader=yaml.SafeLoader)
    estimate_jacobian = config['model_params']['common_params']['estimate_jacobian']
    print(f'estimate jacobian: {estimate_jacobian}')

    relative = False
    adapt_scale = False
    find_best_frame = True
    best_frame = 10
    free_view = False
    yaw = None
    pitch = None
    roll = None

    if find_best_frame or best_frame is not None:
        i = best_frame if best_frame is not None else find_best_frame(source_image, driving_video, cpu=True)
        print("Best frame: " + str(i))
        driving_forward = driving_video[i:]
        driving_backward = driving_video[:(i + 1)][::-1]
        predictions_forward = make_animation(source_image, driving_forward, generator, kp_detector, he_estimator,
                                             relative=relative, adapt_movement_scale=adapt_scale,
                                             estimate_jacobian=estimate_jacobian, cpu=True, free_view=free_view,
                                             yaw=yaw, pitch=pitch, roll=roll)
        predictions_backward = make_animation(source_image, driving_backward, generator, kp_detector, he_estimator,
                                              relative=relative, adapt_movement_scale=adapt_scale,
                                              estimate_jacobian=estimate_jacobian, cpu=True, free_view=free_view,
                                              yaw=yaw, pitch=pitch, roll=roll)
        predictions = predictions_backward[::-1] + predictions_forward[1:]
    else:
        predictions = make_animation(source_image, driving_video, generator, kp_detector, he_estimator,
                                     relative=relative, adapt_movement_scale=adapt_scale,
                                     estimate_jacobian=estimate_jacobian, cpu=True, free_view=free_view,
                                     yaw=yaw, pitch=pitch, roll=roll)

    result_vid_name = 'result_gan_vid/fake_%s.mp4' % file_name

    # a = [img_as_ubyte(frame) for frame in predictions] # 영상 프레임들을 리스트로 저장
    # imageio.v2.mimsave(result_vid_name, a, fps=fps) # 원본 사이즈 그대로 mp4 생성


    imageio.v2.mimsave(result_vid_name, [img_as_ubyte(vid_size_and_resolution_up(frame)) for frame in predictions], fps=fps) # 512로 리사이즈


    sys.stdout.write('\r가짜 이미지와 영상 생성이 완료 되었습니다.')

# 영상 사이즈, 해상도 향상
def vid_size_and_resolution_up(frame):
    f = cv2.resize(frame, (512, 512), cv2.INTER_LANCZOS4)
    return f

# if __name__ == '__main__':
    # img = "./user_image/kimgoeun.jpg"
    # create_fake_img_and_vid(img)
    # os.rmdir('result_gan_vid') # 디렉토리 사제
    # shutil.rmtree('user_image') # 디렉토리와 내부 파일 삭제
    # 디렉 생성안됨 -> 이미지 저장 시도 해보기
    # os.mkdir('user_image')  # 디렉토리 생성