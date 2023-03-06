import glob
import random
import os
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import torchvision.transforms as transforms

# 흑백 이미지를 RGB로 변환
def to_rgb(image):
    rgb_image = Image.new("RGB", image.size)
    rgb_image.paste(image)
    return rgb_image

class ImageDataset(Dataset):
    def __init__(self, root, transforms_=None, unaligned=False, mode="train"):
        self.transform = transforms.Compose(transforms_)
        self.unaligned = unaligned
        # train 모드일 때는 trainA, trainB에 있는 디렉토리에서 이미지를 불러옵니다.
        if mode=="train":
            # glob 함수로 trainA 디렉토리의 이미지의 목록을 불러옵니다.
            self.files_A = sorted(glob.glob(os.path.join(root, "trainA") + "/*.*"))
            self.files_B = sorted(glob.glob(os.path.join(root, "trainB") + "/*.*"))
        else:
            self.files_A = sorted(glob.glob(os.path.join(root, "testA") + "/*.*"))
            self.files_B = sorted(glob.glob(os.path.join(root, "testB") + "/*.*"))

    def __getitem__(self, index):
        # index값으로 이미지의목록 중 이미지 하나를 불러옵니다.
        image_A = Image.open(self.files_A[index % len(self.files_A)])
        # unaligned 변수로 학습할 Pair를 랜덤으로 고릅니다.
        if self.unaligned:
            image_B = Image.open(self.files_B[random.randint(0, len(self.files_B) - 1)])
        else:
            image_B = Image.open(self.files_B[index % len(self.files_B)])

        # 불러온 이미지가 흑백이라면 RGB로 변환
        if image_A.mode != "RGB":
            image_A = to_rgb(image_A)
        if image_B.mode != "RGB":
            image_B = to_rgb(image_B)

        item_A = self.transform(image_A)
        item_B = self.transform(image_B)
        return {"A": item_A, "B": item_B}

    def __len__(self):
        return max(len(self.files_A), len(self.files_B))