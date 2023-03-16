import sys
import os
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
from torch.autograd import Variable
import torch
from models import GeneratorResNet
from PIL import Image
import cv2
import gc

# cuda 메모리 캐시 제거
gc.collect()
torch.cuda.empty_cache()

channels = 3
n_residual_blocks=9
batch_size=1
input_nc = 3
output_nc =3

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

def to_rgb(image):
    rgb_image = Image.new("RGB", image.size)
    rgb_image.paste(image)
    return rgb_image

def image_load(img, t):
    transform = transforms.Compose(t)
    img = Image.open(img)
    if img.mode != "RGB":
        img = to_rgb(img)
    img = transform(img)
    return img

def define_tensor():
    cuda = torch.cuda.is_available()
    Tensor = torch.cuda.FloatTensor if cuda else torch.Tensor
    input_A = Tensor(batch_size, input_nc, get_image_size(img, 'h'), get_image_size(img, 'w'))
    return input_A

def define_dataload(img):
    transforms_ = [ transforms.ToTensor(), transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5)) ]
    dataloader = DataLoader(image_load(img, transforms_),batch_size=batch_size, shuffle=False, num_workers=0)
    return dataloader

def create_repository():
    if not os.path.exists('result_service/G_AB'):
        os.makedirs('result_service/G_AB')

def create_fake_image(img):
    create_repository()

    img_height = get_image_size(img, 'h')
    img_width = get_image_size(img, 'w')
    print('입력된 이미지 세로 사이즈 (pix) :', img_height)
    print('입력된 이미지 가로 사이즈 (pix) :', img_width)

    input_shape = (channels, img_height, img_width)
    G_AB = GeneratorResNet(input_shape, n_residual_blocks)
    G_AB.cuda()

    checkpoint_G_AB = torch.load(r"C:\MyProject\Django\cycle_gan\checkpoint_train_more\toon\G_AB_5.toon.tar")
    G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
    G_AB.eval()

    for i, batch in enumerate(define_dataload(img)):
        real_A = Variable(define_tensor().copy_(batch))
        fake_B = 0.5 * (G_AB(real_A).data + 1.0)

        file_name = img[img.rfind('/') + 1:] # img 경로의 마지막 파일명만 가져오기

        save_image(fake_B, "result_service/G_AB/fake_%s" % file_name)
        sys.stdout.write('\r가짜 이미지 생성이 완료 되었습니다.')
        print(type(fake_B))

if __name__ == '__main__':
    img = "user_image/800.jpg"
    create_fake_image(img)
