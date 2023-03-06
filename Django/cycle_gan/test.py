import sys
import os
import torchvision.transforms as transforms
from torchvision.utils import save_image
from torch.utils.data import DataLoader
from torch.autograd import Variable
import torch
from models import GeneratorResNet
from datasets import ImageDataset

root = r"C:\MyProject\Django\cycle_gan"
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
checkpoint_G_AB = torch.load(r"C:\MyProject\Django\cycle_gan\checkpoint_train\toon\G_AB_4.pth.tar")
checkpoint_G_BA = torch.load(r"C:\MyProject\Django\cycle_gan\checkpoint_train\toon\G_BA_4.pth.tar")
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
transforms_ = [ transforms.ToTensor(),
                transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5)) ]

dataloader = DataLoader(ImageDataset(root + "/data", transforms_=transforms_, mode='test'),
                        batch_size=batch_size, shuffle=False, num_workers=0)

###### Testing######

# Create output dirs if they don't exist
if not os.path.exists('result_test/G_BA'):
    os.makedirs('result_test/G_BA')
if not os.path.exists('result_test/G_AB'):
    os.makedirs('result_test/G_AB')

if __name__ == '__main__':
    for i, batch in enumerate(dataloader):
        # Set model input
        real_A = Variable(input_A.copy_(batch['A']))
        real_B = Variable(input_B.copy_(batch['B']))

        # Generate output
        fake_B = 0.5*(G_AB(real_A).data + 1.0)
        fake_A = 0.5*(G_BA(real_B).data + 1.0)

        # Save image files
        save_image(fake_A, 'result_test/G_BA/%04d.png' % (i+1))
        save_image(fake_B, 'result_test/G_AB/%04d.png' % (i+1))

        sys.stdout.write('\rGenerated images %04d of %04d' % (i+1, len(dataloader)))

    sys.stdout.write('\n')
