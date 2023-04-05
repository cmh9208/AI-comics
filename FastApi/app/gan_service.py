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

from app.cycle_gan.datasets import ImageDataset
from app.cycle_gan.model import GeneratorResNet
from app.face_vid.face_extractor import face_extractor

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

    img = face_extractor(img) # 얼굴 추출

    img_height = get_image_size(img, 'h')
    img_width = get_image_size(img, 'w')
    print('입력된 이미지 세로 사이즈 (pix) :', img_height)
    print('입력된 이미지 가로 사이즈 (pix) :', img_width)
    channels = 3
    input_shape = (channels, img_height, img_width)
    n_residual_blocks = 9
    G_AB = GeneratorResNet(input_shape, n_residual_blocks)
    G_AB.to('cpu')

    checkpoint_G_AB = torch.load("app/cycle_gan/pth/s_6.pth.tar", map_location=torch.device('cpu'))
    G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
    G_AB.eval()

    for i, batch in enumerate(define_dataload(img)):
        real_A = Variable(define_tensor(img).copy_(batch))
        fake_B = 0.5 * (G_AB(real_A).data + 1.0)

        file_name = img[img.rfind('/') + 1:] # images 경로의 마지막 파일명만 가져오기

        save_image(fake_B, "result_gan_vid/fake_%s" % file_name)
        img = imageio.v2.imread("result_gan_vid/fake_%s" % file_name)
        return img

async def create_fake_standard_image(img):
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

    checkpoint_G_AB = torch.load("app/cycle_gan/pth/s_6.pth.tar", map_location=torch.device('cpu'))
    G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
    G_AB.eval()

    for i, batch in enumerate(define_dataload(img)):
        real_A = Variable(define_tensor(img).copy_(batch))
        fake_B = 0.5 * (G_AB(real_A).data + 1.0)

        file_name = img[img.rfind('/') + 1:] # images 경로의 마지막 파일명만 가져오기

        save_image(fake_B, "result_gan_vid/standard_fake_%s" % file_name)
        img = imageio.v2.imread("result_gan_vid/standard_fake_%s" % file_name)
        return img

# if __name__ == '__main__':
    # img = "./user_image/kimgoeun.jpg"
    # create_fake_img_and_vid(img)
    # os.rmdir('result_gan_vid') # 디렉토리 사제
    # shutil.rmtree('user_image') # 디렉토리와 내부 파일 삭제
    # 디렉 생성안됨 -> 이미지 저장 시도 해보기
    # os.mkdir('user_image')  # 디렉토리 생성