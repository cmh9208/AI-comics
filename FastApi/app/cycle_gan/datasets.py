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
    def __init__(self, img, transforms_=None, unaligned=False, mode="test"):
        self.transform = transforms.Compose(transforms_)
        self.unaligned = unaligned
        # train 모드일 때는 trainA, trainB에 있는 디렉토리에서 이미지를 불러옵니다.
        if mode=="test":
            # glob 함수로 trainA 디렉토리의 이미지의 목록을 불러옵니다.
            self.files_A = os.path.join(img)

    def __getitem__(self, index):
        # 이미지의목록 중 이미지 하나를 불러옵니다.
        image_A = Image.open(self.files_A)

        # 불러온 이미지가 흑백이라면 RGB로 변환
        if image_A.mode != "RGB":
            image_A = to_rgb(image_A)

        item_A = self.transform(image_A)
        return item_A

    def __len__(self):
        return len(self.files_A)