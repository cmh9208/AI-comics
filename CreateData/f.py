import sys

from keras.preprocessing.image import ImageDataGenerator
from keras_preprocessing.image import array_to_img, img_to_array, load_img
from matplotlib import pyplot as plt
from PIL import Image
import os
os.makedirs("data/rotated", exist_ok=True)
# 이미지 데이터 생성기 생성
datagen = ImageDataGenerator(
        rescale=1./255,         # 이미지 픽셀 값을 0~1 사이로 정규화
        rotation_range=30,      # 회전 범위
        # width_shift_range=0.2,  # 가로 이동 범위
        # height_shift_range=0.2, # 세로 이동 범위
        shear_range=0.5,        # 전단 변환 범위
        zoom_range=0.1,         # 확대/축소 범위
        fill_mode='nearest')    # 이미지 변환 후 빈 공간 채우기 방식


# 이미지 파일이 들어있는 폴더 경로
folder_path = 'data/trainB/'

# 폴더 안의 모든 이미지 파일 경로 리스트 생성
img_paths = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if f.endswith('.png')]
j = 0
# 모든 이미지에 대해 증강된 이미지 생성
for img_path in img_paths:
    total = len(img_paths)
    # 이미지 불러오기
    img = Image.open(img_path)

    # 이미지 증강
    x = img_to_array(img)
    x = x.reshape((1,) + x.shape)
    i = 0
    j += 1
    sys.stdout.write("\r %s / %s" % (j, total))
    for batch in datagen.flow(x, batch_size=1):
        plt.figure(i)
        img = array_to_img(batch[0])
        i += 1
        img_save_path = os.path.join('data/rotated', os.path.basename(img_path).split('.')[0] + '_rotated_%s.png' % i)
        img.save(img_save_path)
        if i % 1 == 0:
            break


