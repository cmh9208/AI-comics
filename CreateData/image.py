import os
import glob
import sys
import cv2
from PIL import Image


# 이미지 자르기
def cut_img(images):
    os.makedirs("data/star_720", exist_ok=True)
    total = len(images*2)
    j = -1
    k = 0
    for i in images:
        j += 2
        k += 2
        src = cv2.imread(i, cv2.IMREAD_COLOR)
        roi = src[0:1440, 640:1440]
        # roi2 = src[0:720, 560:1280]
        cv2.imwrite("data/star_720/720_%s.jpg" % j, roi)
        # cv2.imwrite("data/star_720/720_%ss.jpg" % k, roi2)
        sys.stdout.write("\r %s / %s" %(j, total))

# 이미지 사이즈 변경
def img_resize(images):
    os.makedirs("data/face_256", exist_ok=True)
    total = len(images)
    for i, j in enumerate(images):
        src = cv2.imread(j, cv2.IMREAD_COLOR)
        resize_img = cv2.resize(src, (256, 256), interpolation=cv2.INTER_AREA)
        cv2.imwrite("data/face_256/Selfie_%s.jpg" % i, resize_img)
        sys.stdout.write("\r %s / %s" % (i, total))

# 이미지 사이즈 체크
def img_size_check(images):
    for i in images:
        img = Image.open(i)
        h = img.height
        print(h)


# 이미지 데이터 증강(좌우 반전)
def data_augmentation(images):
    os.makedirs("data/reverse", exist_ok=True)
    total = len(images)
    for i, j in enumerate(images):
        img = Image.open(j)
        img = img.transpose(Image.FLIP_LEFT_RIGHT) # 좌우 반전
        img.save("data/reverse/reverse_%s.png" % i)
        sys.stdout.write("\r %s / %s" % (i, total))


if __name__ == '__main__':
    images = glob.glob('data/ss/*.jpg')
    img_resize(images)
