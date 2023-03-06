import random
from torch.utils.data import DataLoader
from PIL import Image
import torchvision.transforms as transforms
import sys
import torch
import os
import numpy as np
import itertools
import datetime
import time
from torchvision.utils import save_image, make_grid
from torch.autograd import Variable
from models import GeneratorResNet, Discriminator
from datasets import ImageDataset

def weights_init_normal(m):
    classname = m.__class__.__name__
    if classname.find("Conv") != -1:
        torch.nn.init.normal_(m.weight.data, 0.0, 0.02)
        if hasattr(m, "bias") and m.bias is not None:
            torch.nn.init.constant_(m.bias.data, 0.0)
    elif classname.find("BatchNorm2d") != -1:
        torch.nn.init.normal_(m.weight.data, 1.0, 0.02)
        torch.nn.init.constant_(m.bias.data, 0.0)

root = r"C:\MyProject\Django\cycle_gan\data"
pth_root = r"C:\MyProject\Django\cycle_gan"
dataset_name="toon"
channels = 3
img_height = 256
img_width = 256
n_residual_blocks=9
lr=0.0002
b1=0.5
b2=0.999
n_epochs=4
init_epoch=0
decay_epoch=2
lambda_cyc=10.0
lambda_id=5.0
n_cpu=8
batch_size=1
sample_interval=20
checkpoint_interval=1

os.makedirs("result_train_more/%s" % dataset_name, exist_ok=True)
os.makedirs("checkpoint_train_more/%s" % dataset_name, exist_ok=True)

# Loss function
criterion_GAN = torch.nn.MSELoss()
criterion_cycle = torch.nn.L1Loss()
criterion_identity = torch.nn.L1Loss()
input_shape = (channels, img_height, img_width)

G_AB = GeneratorResNet(input_shape, n_residual_blocks)
G_BA = GeneratorResNet(input_shape, n_residual_blocks)
D_A = Discriminator(input_shape)
D_B = Discriminator(input_shape)
cuda = torch.cuda.is_available()

# Assign to GPU
if cuda:
    G_AB = G_AB.cuda()
    G_BA = G_BA.cuda()
    D_A = D_A.cuda()
    D_B = D_B.cuda()
    criterion_GAN.cuda()
    criterion_cycle.cuda()
    criterion_identity.cuda()

# weight initialization
G_AB.apply(weights_init_normal)
G_BA.apply(weights_init_normal)
D_A.apply(weights_init_normal)
D_B.apply(weights_init_normal)

# Optimizers
optimizer_G = torch.optim.Adam(
    itertools.chain(G_AB.parameters(), G_BA.parameters()), lr=lr, betas=(b1, b2)
)
optimizer_D_A = torch.optim.Adam(D_A.parameters(), lr=lr, betas=(b1, b2))
optimizer_D_B = torch.optim.Adam(D_B.parameters(), lr=lr, betas=(b1, b2))

#############################################################################
# 모델과 옵티마이저가 모두 정의된 다음 중간 모델 정보로 치환함
checkpoint_G_AB = torch.load(os.path.join(pth_root, "checkpoint_train", "toon", "G_AB_1.pth.tar"))
checkpoint_G_BA = torch.load(os.path.join(pth_root, "checkpoint_train", "toon", "G_AB_1.pth.tar"))
checkpoint_D_A = torch.load(os.path.join(pth_root, "checkpoint_train", "toon", "D_A_1.pth.tar"))
checkpoint_D_B = torch.load(os.path.join(pth_root, "checkpoint_train", "toon", "D_B_1.pth.tar"))

# 저장했던 중간 모델 정보로 모델 치환.
G_AB.load_state_dict(checkpoint_G_AB['state_dict'])
G_BA.load_state_dict(checkpoint_G_BA['state_dict'])
D_A.load_state_dict(checkpoint_D_A['state_dict'])
D_B.load_state_dict(checkpoint_D_B['state_dict'])

optimizer_G.load_state_dict(checkpoint_G_AB['optimizer_state_dict'])
optimizer_D_A.load_state_dict(checkpoint_D_A['optimizer_state_dict'])
optimizer_D_B.load_state_dict(checkpoint_D_B['optimizer_state_dict'])
#############################################################################

class LambdaLR:
    def __init__(self, n_epochs, offset, decay_start_epoch):
        assert (n_epochs - decay_start_epoch) > 0
        self.n_epochs = n_epochs
        self.offset = offset
        self.decay_start_epoch = decay_start_epoch

    def step(self, epoch):
        return 1.0 - max(0, epoch + self.offset - self.decay_start_epoch) / (self.n_epochs - self.decay_start_epoch)

# Learning rate scheduler
lr_scheduler_G = torch.optim.lr_scheduler.LambdaLR(
    optimizer_G, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)
lr_scheduler_D_A = torch.optim.lr_scheduler.LambdaLR(
    optimizer_D_A, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)
lr_scheduler_D_B = torch.optim.lr_scheduler.LambdaLR(
    optimizer_D_B, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)

Tensor = torch.cuda.FloatTensor if cuda else torch.Tensor

class ReplayBuffer:
    def __init__(self, max_size=50):
        assert max_size > 0
        self.max_size = max_size
        self.data = []

    def push_and_pop(self, data):
        to_return = []
        for element in data.data:
            element = torch.unsqueeze(element, 0)
            if len(self.data) < self.max_size:
                self.data.append(element)
                to_return.append(element)
            else:
                if random.uniform(0, 1) > 0.5:
                    i = random.randint(0, self.max_size - 1)
                    to_return.append(self.data[i].clone())
                    self.data[i] = element
                else:
                    to_return.append(element)
        return Variable(torch.cat(to_return))

# Buffers of previously generated samples
fake_A_buffer = ReplayBuffer()
fake_B_buffer = ReplayBuffer()

# Image transformations
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

# save image
def sample_images(batches_done):
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
    save_image(image_grid, "result_train_more/%s/%s.png" % (dataset_name, batches_done), normalize=False)

prev_time = time.time()

#############################################################################
start_epoch = checkpoint_G_AB['epoch'] + 1
#############################################################################
if __name__ == '__main__':
    for epoch in range(start_epoch, n_epochs):
        for i, batch in enumerate(dataloader):

            real_A = Variable(batch["A"].type(Tensor))
            real_B = Variable(batch["B"].type(Tensor))

            valid = Variable(Tensor(np.ones((real_A.size(0), *D_A.output_shape))), requires_grad=False)
            fake = Variable(Tensor(np.zeros((real_A.size(0), *D_A.output_shape))), requires_grad=False)

            G_AB.train()
            G_BA.train()

            optimizer_G.zero_grad()

            loss_id_A = criterion_identity(G_BA(real_A), real_A)
            loss_id_B = criterion_identity(G_AB(real_B), real_B)

            loss_identity = (loss_id_A + loss_id_B) / 2

            fake_B = G_AB(real_A)
            loss_GAN_AB = criterion_GAN(D_B(fake_B), valid)

            fake_A = G_BA(real_B)
            loss_GAN_BA = criterion_GAN(D_A(fake_A), valid)

            loss_GAN = (loss_GAN_AB + loss_GAN_BA) / 2

            recov_A = G_BA(fake_B)
            loss_cycle_A = criterion_cycle(recov_A, real_A)

            recov_B = G_AB(fake_A)
            loss_cycle_B = criterion_cycle(recov_B, real_B)

            loss_cycle = (loss_cycle_A + loss_cycle_B) / 2

            loss_G = loss_GAN + lambda_cyc * loss_cycle + lambda_id * loss_identity
            loss_G.backward()

            optimizer_G.step()
            optimizer_D_A.zero_grad()

            loss_real = criterion_GAN(D_A(real_A), valid)

            fake_A_ = fake_A_buffer.push_and_pop(fake_A)
            loss_fake = criterion_GAN(D_A(fake_A_.detach()), fake)

            loss_D_A = (loss_real + loss_fake) / 2
            loss_D_A.backward()

            optimizer_D_A.step()
            optimizer_D_B.zero_grad()

            loss_real = criterion_GAN(D_B(real_B), valid)

            fake_B_ = fake_B_buffer.push_and_pop(fake_B)
            loss_fake = criterion_GAN(D_B(fake_B_.detach()), fake)

            loss_D_B = (loss_real + loss_fake) / 2

            loss_D_B.backward()
            optimizer_D_B.step()

            loss_D = (loss_D_A + loss_D_B) / 2

            batches_done = epoch * len(dataloader) + i
            batches_left = n_epochs * len(dataloader) - batches_done
            time_left = datetime.timedelta(seconds=batches_left * (time.time() - prev_time))
            prev_time = time.time()

            sys.stdout.write(
                "\r[Epoch %d/%d] [Batch %d/%d] [D loss: %f] [G loss: %f, adv: %f, cycle: %f, identity: %f] ETA: %s"
                % (
                    epoch,
                    n_epochs,
                    i,
                    len(dataloader),
                    loss_D.item(),
                    loss_G.item(),
                    loss_GAN.item(),
                    loss_cycle.item(),
                    loss_identity.item(),
                    time_left,
                )
            )

            if batches_done % sample_interval == 0:
                sample_images(batches_done)

        lr_scheduler_G.step()
        lr_scheduler_D_A.step()
        lr_scheduler_D_B.step()

        if checkpoint_interval != -1 and epoch % checkpoint_interval == 0:
            torch.save({'state_dict': G_AB.state_dict(),
                        'optimizer_state_dict': optimizer_G.state_dict(),
                        'epoch': epoch,
                        }, "checkpoint_train_more/%s/G_AB_%d.pth.tar" % (dataset_name, epoch))

            torch.save({'state_dict': G_BA.state_dict(),
                        'optimizer_state_dict': optimizer_G.state_dict(),
                        'epoch': epoch,
                        }, "checkpoint_train_more/%s/G_BA_%d.pth.tar" % (dataset_name, epoch))

            torch.save({'state_dict': D_A.state_dict(),
                        'optimizer_state_dict': optimizer_D_A.state_dict(),
                        'epoch': epoch,
                        }, "checkpoint_train_more/%s/D_A_%d.pth.tar" % (dataset_name, epoch))

            torch.save({'state_dict': D_B.state_dict(),
                        'optimizer_state_dict': optimizer_D_B.state_dict(),
                        'epoch': epoch,
                        }, "checkpoint_train_more/%s/D_B_%d.pth.tar" % (dataset_name, epoch))


