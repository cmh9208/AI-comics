import sys
import os
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
from torch.autograd import Variable
import torch
from models import GeneratorResNet
from datasets import ImageDataset
from torchvision.utils import save_image, make_grid
from PIL import Image

root = r"C:\MyProject\Django\cycle_gan\data"
channels = 3
img_height = 256
img_width = 256
n_residual_blocks=9
batch_size=1
input_nc = 3
output_nc =3
cuda = torch.cuda.is_available()

###### Definition of variables ######
# Networks
input_shape = (channels, img_height, img_width)
G_AB = GeneratorResNet(input_shape, n_residual_blocks)
G_BA = GeneratorResNet(input_shape, n_residual_blocks)

if cuda:
    G_AB.cuda()
    G_BA.cuda()

# Load state dicts
checkpoint_G_AB = torch.load(r"C:\MyProject\Django\cycle_gan\checkpoint_train\toon\G_AB_20.pth.tar")
checkpoint_G_BA = torch.load(r"C:\MyProject\Django\cycle_gan\checkpoint_train\toon\G_AB_20.pth.tar")
G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
G_BA.load_state_dict(checkpoint_G_BA['state_dict'])

# Set model's test mode
G_AB.eval()
G_BA.eval()

# Inputs & targets memory allocation
Tensor = torch.cuda.FloatTensor if cuda else torch.Tensor
input_A = Tensor(batch_size, input_nc, img_height, img_width)
input_B = Tensor(batch_size, output_nc, img_height, img_width)

# Dataset loader
transforms_ = [
    transforms.Resize(int(img_height * 1.12), Image.BICUBIC),
    transforms.RandomCrop((img_height, img_width)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
    ]

dataloader = DataLoader(
    ImageDataset(root, transforms_=transforms_, unaligned=True),
    batch_size=batch_size,
    shuffle=True,
    num_workers=0,
)

# Test data loader
val_dataloader = DataLoader(
    ImageDataset(root, transforms_=transforms_, unaligned=True, mode="test"),
    batch_size=5,
    shuffle=True,
    num_workers=0,
)

###### Testing######

# Create output dirs if they don't exist
os.makedirs('result_test', exist_ok=True)
def sample_images():
    imgs = next(iter(val_dataloader))
    G_AB.eval()
    G_BA.eval()
    real_A = Variable(imgs["A"].type(Tensor))
    fake_B = G_AB(real_A)
    real_B = Variable(imgs["B"].type(Tensor))
    fake_A = G_BA(real_B)
    real_A = make_grid(real_A, nrow=5, normalize=True)
    real_B = make_grid(real_B, nrow=5, normalize=True)
    fake_A = make_grid(fake_A, nrow=5, normalize=True)
    fake_B = make_grid(fake_B, nrow=5, normalize=True)
    image_grid = torch.cat((real_A, fake_B, real_B, fake_A), 1)
    save_image(image_grid, "result_test/%.png", normalize=False)

if __name__ == '__main__':
    sample_images()
