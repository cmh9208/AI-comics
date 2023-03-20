import os, sys, matplotlib, imageio, torch
import cv2
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
from torch.autograd import Variable
from PIL import Image

import gc
from app.cycle_gan.datasets import ImageDataset
from app.cycle_gan.model import GeneratorResNet


matplotlib.use('Agg')

# cuda 메모리 캐시 제거
def remove_memory_cash():
    gc.collect()
    torch.cuda.empty_cache()

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
    cuda = torch.cuda.is_available()
    Tensor = torch.cuda.FloatTensor if cuda else torch.Tensor
    input_nc = 3
    batch_size = 1
    input_A = Tensor(batch_size, input_nc, get_image_size(img, 'h'), get_image_size(img, 'w'))
    return input_A

def define_dataload(img):
    transforms_ = [transforms.ToTensor(), transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))]
    dataloader = DataLoader(ImageDataset(img, transforms_=transforms_, mode='test'),batch_size=1, shuffle=False, num_workers=0)
    return dataloader

def create_repository():
    if not os.path.exists('result_gan'):
        os.makedirs('result_gan')
def app_create_fake_image(img):
    create_repository()
    img_height = get_image_size(img, 'h')
    img_width = get_image_size(img, 'w')
    print('입력된 이미지 세로 사이즈 (pix) :', img_height)
    print('입력된 이미지 가로 사이즈 (pix) :', img_width)
    channels = 3
    input_shape = (channels, img_height, img_width)
    n_residual_blocks = 9
    G_AB = GeneratorResNet(input_shape, n_residual_blocks)
    G_AB.cuda()

    checkpoint_G_AB = torch.load("./cycle_gan/pth/G_AB_8.pth.tar")
    G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
    G_AB.eval()

    for i, batch in enumerate(define_dataload(img)):
        real_A = Variable(define_tensor(img).copy_(batch))
        fake_B = 0.5 * (G_AB(real_A).data + 1.0)

        file_name = img[img.rfind('/') + 1:] # images 경로의 마지막 파일명만 가져오기

        save_image(fake_B, "./result_gan/fake_%s" % file_name)
        img = imageio.v2.imread("./result_gan/fake_%s" % file_name)
        return img

if __name__ == '__main__':
    remove_memory_cash()
    img = "./user_image/kimgoeun.jpg"
    app_create_fake_image(img)
