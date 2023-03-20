import os
import glob
import sys
import cv2
from PIL import Image


# 이미지 자르기
def cut_img(images):
    os.makedirs("data/ghibli_690", exist_ok=True)
    total = len(images*2)
    j = -1
    k = 0
    for i in images:
        j += 2
        k += 2
        src = cv2.imread(i, cv2.IMREAD_COLOR)
        roi = src[15:705, 0:690] # y, x
        roi2 = src[15:705, 590:1280]
        cv2.imwrite("data/ghibli_690/690_%s.jpg" % j, roi)
        cv2.imwrite("data/ghibli_690/690_%ss.jpg" % k, roi2)
        sys.stdout.write("\r %s / %s" %(j, total))

# 이미지 사이즈 변경
def img_resize(images):
    os.makedirs("fff", exist_ok=True)
    total = len(images)
    for i, j in enumerate(images):
        src = cv2.imread(j, cv2.IMREAD_COLOR)
        resize_img = cv2.resize(src, (256, 256), interpolation=cv2.INTER_AREA)
        cv2.imwrite("fff/train_b_%s.png" % i, resize_img)
        sys.stdout.write("\r %s / %s" % (i, total))

# 이미지 사이즈 체크
def img_size_check(images):
    for i in images:
        img = Image.open(i)
        h = img.height
        print(h)


# 이미지 데이터 증강(좌우 반전)
def img_reverse(images):
    os.makedirs("data/reverse", exist_ok=True)
    total = len(images)
    for i, j in enumerate(images):
        img = Image.open(j)
        img = img.transpose(Image.FLIP_LEFT_RIGHT) # 좌우 반전
        img.save("data/reverse/reverse_%s.jpg" % i)
        sys.stdout.write("\r %s / %s" % (i, total))

def img_rotate(images):
    os.makedirs("rotate", exist_ok=True)
    for i, j in enumerate(images):
        img = Image.open(j)
        rotated_img1 = img.rotate(90, expand=True)
        rotated_img1.save("rotate/clockwise2_%s.jpg" % i)

if __name__ == '__main__':
    # 변경 전 확장자 확인!
    images = glob.glob('human/*.png')
    img_resize(images)
