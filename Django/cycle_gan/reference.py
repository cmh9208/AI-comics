import glob
import random
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import torchvision.transforms as transforms
import sys
import torch.nn as nn
import torch.nn.functional as F
import torch
import os
import numpy as np
import math
import itertools
import datetime
import time
from torchvision.utils import save_image, make_grid
from torchvision import datasets
from torch.autograd import Variable

root = r"C:\MyProject\Django\cycle_gan\data"

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

def weights_init_normal(m):
    classname = m.__class__.__name__
    if classname.find("Conv") != -1:
        torch.nn.init.normal_(m.weight.data, 0.0, 0.02)
        if hasattr(m, "bias") and m.bias is not None:
            torch.nn.init.constant_(m.bias.data, 0.0)
    elif classname.find("BatchNorm2d") != -1:
        torch.nn.init.normal_(m.weight.data, 1.0, 0.02)
        torch.nn.init.constant_(m.bias.data, 0.0)

# generator 내부에 들어갈 Residual Block (잔차블록) 레이어
# 이전 layer와 현재 layer의 출력값을 더해 forward 함
# 모델이 깊어짐에 따라 생기는 기울기 소실 문제 해결
# 더하기 연산 으로는 기울기가 작아지지 않고 back propagation 이 일어나기 때문
class ResidualBlock(nn.Module):
    def __init__(self, in_features):
        super(ResidualBlock, self).__init__()

        self.block = nn.Sequential(
            # reflection padding 은 점대칭 방식으로 가장 가까운 픽셀로부터 값을 복사 해옴
            # zero padding 처럼 값 지정이 아닌 더욱 자연 스러운 이미지 생성을 위해 사용
            nn.ReflectionPad2d(1),
            nn.Conv2d(in_features, in_features, 3),
            # instance normalization 은 데이터 개별로 정규화를 진행(이미지에 특화된 정규화 과정)
            # 정규화는 데이터 값의 범위를 비슷하게 조정하는 과정
            # 배치 정규화는 데이터의 배치 단위로 편균, 분산을 구하여 학습 안정성을 높이는 것 (다른개념)
            nn.InstanceNorm2d(in_features),
            nn.ReLU(inplace=True),
            nn.ReflectionPad2d(1),
            nn.Conv2d(in_features, in_features, 3),
            nn.InstanceNorm2d(in_features),
        )

    def forward(self, x):
        # Residua lBlock 에서 이전 layer의 출력값을 더하기 위해선 입력 feature의 개수와 출력 feature가 같아야함
        # generator의 Residual Block 이 늘러 날수록 더많은 계층적인 정보를 바탕으로 더 그럴듯한 이미지가 만들어짐
        return x + self.block(x)

class GeneratorResNet(nn.Module):
    def __init__(self, input_shape, num_residual_blocks):
        super(GeneratorResNet, self).__init__()

        channels = input_shape[0]

        # Initial convolution block(초리 컨벌루션 블록 선언)
        out_features = 64
        model = [
            nn.ReflectionPad2d(channels),
            nn.Conv2d(channels, out_features, 7),
            nn.InstanceNorm2d(out_features),
            nn.ReLU(inplace=True),
        ]
        in_features = out_features

        # Downsampling(다운 샘플리 2번 진행, stride=2 이므로 이미지가 반씩 줄어듬)
        for _ in range(2):
            out_features *= 2
            model += [
                nn.Conv2d(in_features, out_features, 3, stride=2, padding=1),
                nn.InstanceNorm2d(out_features),
                nn.ReLU(inplace=True),
            ]
            in_features = out_features

        # Residual blocks
        for _ in range(num_residual_blocks):
            model += [ResidualBlock(out_features)]

        # Upsampling(업 샘플링 2번 진행해 크기를 2배로 2번 늘림)
        for _ in range(2):
            out_features //= 2
            model += [
                nn.Upsample(scale_factor=2),
                nn.Conv2d(in_features, out_features, 3, stride=1, padding=1),
                nn.InstanceNorm2d(out_features),
                nn.ReLU(inplace=True),
            ]
            in_features = out_features

        # Output layer(출력 이미지는 입력 이미지의 크기와 같아짐)
        model += [nn.ReflectionPad2d(channels), nn.Conv2d(out_features, channels, 7), nn.Tanh()] # 활성 함수로 하이퍼볼릭 탄젠트

        self.model = nn.Sequential(*model)

    def forward(self, x):
        return self.model(x)

# 사이클겐의 판별자는 patchGAN의 판별자를 기반으로 "정사각"형의 이미지 패치 영역에 대하여 생성 이미지의 진짜, 가짜 여부 판단
# 생성 이미지의 영역을 분할해 판단함
# 이미지에서 각각의 패치영역으로 따로 판단 -> 전체가 아닌 작은 패치에 대한 연산으로 파라미터 개수가 작아지고 속도가 더 빠름
# 영역을 분할하지 않는다면 생성자는 우리가 학습하려는 스타일이 아닌 엉뚱한 특징으로 판별자를 속임
class Discriminator(nn.Module):
    def __init__(self, input_shape):
        super(Discriminator, self).__init__()

        channels, height, width = input_shape

        # Calculate output shape of image discriminator (PatchGAN) (판별자의 출력 크기를 정의)
        # 출력은 0 또는 1의 값이 아닌 입력 이미지의 1/16인 이진화된 피처맵이 나옴(이미지가 256*256이라면 16*16)
        self.output_shape = (1, height // 2 ** 4, width // 2 ** 4)

        # 다운 샘플링하며 출력 크기를 줄임
        # discriminator_block 를 4번 통과하면 256->16으로 다운 샘플링됨
        def discriminator_block(in_filters, out_filters, normalize=True):
            layers = [nn.Conv2d(in_filters, out_filters, 4, stride=2, padding=1)]
            if normalize:
                layers.append(nn.InstanceNorm2d(out_filters))
            layers.append(nn.LeakyReLU(0.2, inplace=True))
            return layers

        self.model = nn.Sequential(
            *discriminator_block(channels, 64, normalize=False),
            *discriminator_block(64, 128),
            *discriminator_block(128, 256),
            *discriminator_block(256, 512),
            nn.ZeroPad2d((1, 0, 1, 0)),
            nn.Conv2d(512, 1, 4, padding=1)
        )

    def forward(self, img):
        return self.model(img)

dataset_name="pikapika" # 학습 데이터가 있는 폴더명
channels = 3 # 이미지의 채널, 흑백일 때는 1, RGB 일때는 3
img_height = 256
img_width = 256
n_residual_blocks=9 # generator의 residual_blocks(잔차블록) 개수
lr=0.0002 # 모델에 대한 learning rate(학습률)

# adam 옵티마이저에 대한 하이퍼 파라미터
b1=0.5
b2=0.999

n_epochs=2
init_epoch=0
decay_epoch=1

lambda_cyc=10.0 # cycle-consistency Loss에 대한 람다값
lambda_id=5.0 # identity Loss에 대한 람다값(값이 클수록 본래의 색감을 유지 하려는 성질이 커짐)

n_cpu=8
batch_size=1
sample_interval=100
checkpoint_interval=1

# exist_ok=True 로 지정하면 같은 이름의 폴더가 있어도 오류가 나지 않음
os.makedirs("result_reference/%s" % dataset_name, exist_ok=True)
os.makedirs("checkpoint_reference/%s" % dataset_name, exist_ok=True)

# 손실함수 정의
criterion_GAN = torch.nn.MSELoss() # MSELoss -> (평균 제곱 오차)정답에 가까울수록 작은 값이 나옴
criterion_cycle = torch.nn.L1Loss()
criterion_identity = torch.nn.L1Loss()
input_shape = (channels, img_height, img_width)

# 모델 객체 선언
# Initialize(초기화) generator and discriminator
# 각각 print 해보기
G_AB = GeneratorResNet(input_shape, n_residual_blocks)
G_BA = GeneratorResNet(input_shape, n_residual_blocks)
D_A = Discriminator(input_shape)
D_B = Discriminator(input_shape)
cuda = torch.cuda.is_available() # gpu 연산이 가능한지 확인, 가능하면 ture, 아니면 false 반환

# true라면 생성자, 판별자, 손실함수 객체를 .cuda()로 gpu에 로드
if cuda:
    G_AB = G_AB.cuda()
    G_BA = G_BA.cuda()
    D_A = D_A.cuda()
    D_B = D_B.cuda()
    criterion_GAN.cuda()
    criterion_cycle.cuda()
    criterion_identity.cuda()

# 위에서 정의한 weights_init_normal 함수로 가중치 초기화
# apply 함수로 각 네트워크에 있는 모든 layer에 가중치 초기화 적용가능)
G_AB.apply(weights_init_normal)
G_BA.apply(weights_init_normal)
D_A.apply(weights_init_normal)
D_B.apply(weights_init_normal)

# Optimizers(옵티마이저 정의)
optimizer_G = torch.optim.Adam(
    itertools.chain(G_AB.parameters(), G_BA.parameters()), lr=lr, betas=(b1, b2)
)
optimizer_D_A = torch.optim.Adam(D_A.parameters(), lr=lr, betas=(b1, b2))
optimizer_D_B = torch.optim.Adam(D_B.parameters(), lr=lr, betas=(b1, b2))

# learning rate 를 decay(부식, 붕괴) 할 epoch를 정함
class LambdaLR:
    def __init__(self, n_epochs, offset, decay_start_epoch):
        assert (n_epochs - decay_start_epoch) > 0, "교육 세션이 끝나기 전에 붕괴가 시작되어야 합니다!"
        self.n_epochs = n_epochs
        self.offset = offset
        self.decay_start_epoch = decay_start_epoch

    def step(self, epoch):
        return 1.0 - max(0, epoch + self.offset - self.decay_start_epoch) / (self.n_epochs - self.decay_start_epoch)

# Learning rate 스케쥴러 정의
lr_scheduler_G = torch.optim.lr_scheduler.LambdaLR(
    optimizer_G, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)
lr_scheduler_D_A = torch.optim.lr_scheduler.LambdaLR(
    optimizer_D_A, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)
lr_scheduler_D_B = torch.optim.lr_scheduler.LambdaLR(
    optimizer_D_B, lr_lambda=LambdaLR(n_epochs, init_epoch, decay_epoch).step
)
# tensor 연산에 사용할 tensor 자료형 정의
Tensor = torch.cuda.FloatTensor if cuda else torch.Tensor

# torch 변수가 requires_grad=True 로 지정되어 있다면 매 연산마다 gradient를 저장하므로
# cycle gan 학습을 위해서는 ReplayBuffer 클래스를 톨해 이미지를 따로 저장해야함
class ReplayBuffer:
    def __init__(self, max_size=50):
        assert max_size > 0, "Empty buffer or trying to create a black hole. Be careful."
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
# 이제 datasets 클래스로 이미지를 불러오는 방식에 대하여 정의함
transforms_ = [
    transforms.Resize(int(img_height * 1.12), Image.BICUBIC), # PIL 이미지를 가로, 세로 1.12배 확대 보간방식은 BICUBIC
    transforms.RandomCrop((img_height, img_width)), # PIL 이미지를 가로, 세로 길이만큼 무작위로 잘라냄
    transforms.RandomHorizontalFlip(), # PIL 이미지를 무작위로 좌우로 뒤집음
    transforms.ToTensor(), # PIL 이미지를 0~1 사이의 Tensor 자료형으로 변환
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)), # RGB 채널별로 픽셀 값이 0.5, 표준편차가 0.5가 되도록 정규화
]

# 학습 혹은 평가 중 이미지 데이터를 불러올 dataloader를 정의
# 앞서 정의한 ImageDataset 클래스로 data 폴더에서 transform_을 적용한 이미지를 배치 사이즈 만큼 불러옴
# gpu 메모리 부족으로 oom 이슈가 나면 배치 사이즈를 줄여야함
dataloader = DataLoader(
    ImageDataset(root, transforms_=transforms_, unaligned=True),
    batch_size=batch_size,
    shuffle=True,
    num_workers=0, # cpu 유틸리티 설정
)

# Test data loader
val_dataloader = DataLoader(
    ImageDataset(root, transforms_=transforms_, unaligned=True, mode="test"),
    batch_size=5,
    shuffle=True,
    num_workers=0,
)

# 학습 중 생성한 이미지를 시각화하여 저장하는 함수
# val_dataloader 사이즈가 5 이므로 make_grid 함수를 통해 5개씩 샘플을 생성하여 image폴더에 저장함
def sample_images(batches_done):
    """Saves a generated sample from the test set"""
    imgs = next(iter(val_dataloader))
    # eval 은 사용하지 않는 레이어를 끔
    G_AB.eval()
    G_BA.eval()
    real_A = Variable(imgs["A"].type(Tensor))
    fake_B = G_AB(real_A)
    real_B = Variable(imgs["B"].type(Tensor))
    fake_A = G_BA(real_B)
    # Arange images along x-axis
    real_A = make_grid(real_A, nrow=5, normalize=True)
    real_B = make_grid(real_B, nrow=5, normalize=True)
    fake_A = make_grid(fake_A, nrow=5, normalize=True)
    fake_B = make_grid(fake_B, nrow=5, normalize=True)
    # Arange images along y-axis
    image_grid = torch.cat((real_A, fake_B, real_B, fake_A), 1)
    save_image(image_grid, "result_reference/%s/%s.png" % (dataset_name, batches_done), normalize=False)

prev_time = time.time()

for epoch in range(init_epoch, n_epochs):
    for i, batch in enumerate(dataloader):

        # (1) dataloader에서 실제 사진 이미지(A)와 애니매이션 이미지(B)를 배치 사이즈 만큼 불러옴
        real_A = Variable(batch["A"].type(Tensor))
        real_B = Variable(batch["B"].type(Tensor))

        # (2) 판변자의 레이블 값을 만듦
        # patchGAN에 따라 valid 변수는 판별자의 출력 크기만큼 전부 1로 채워짐
        valid = Variable(Tensor(np.ones((real_A.size(0), *D_A.output_shape))), requires_grad=False)
        # fake 변수는 판별자의 출력 크기만큼 전부 0으로 채워짐
        fake = Variable(Tensor(np.zeros((real_A.size(0), *D_A.output_shape))), requires_grad=False)

        # (3) 생성자를 학습

        G_AB.train()
        G_BA.train()
        '''
        Pytorch에서는 gradients값들을 추후에 backward를 해줄때 계속 더해주기 때문에
        항상 backpropagation을 하기전에 gradients를 zero로 만들어주고 시작을 해야함
        한번의 학습이 완료되어지면(즉, Iteration이 한번 끝나면) gradients를 항상 0으로 만들어 주어야 합니다.
        만약 gradients를 0으로 초기화해주지 않으면 gradient가 의도한 방향이랑
        다른 방향을 가르켜 학습이 원하는 방향으로 이루어 지지 않습니다.
        '''
        '''
        데이터 = 100
        미니배치 = 10
        에포크 = 1 일때, 
        이터레이션 = 10 
        '''
        optimizer_G.zero_grad()

        # (4) 색감, 형태등을 유지하기 위한 identity loss 계산
        loss_id_A = criterion_identity(G_BA(real_A), real_A) # G_BA에 실제 이미 A를 입력한 후 이를 real_A와 비교하여 L1loss계산
        loss_id_B = criterion_identity(G_AB(real_B), real_B)

        loss_identity = (loss_id_A + loss_id_B) / 2

        # (5) GAN Loss 계산
        fake_B = G_AB(real_A) # 이미지 real_A 로부터 스타일이 변환된 가짜 이미지 fake_B를 생성
        loss_GAN_AB = criterion_GAN(D_B(fake_B), valid) # 판별자 D_B는 생성된 fake_B가 진짜인지 분류함 그 후에
                                                        # 판별자 D_B를 속이도록 G_BA의 GAN Loss를 계산함
        fake_A = G_BA(real_B)
        loss_GAN_BA = criterion_GAN(D_A(fake_A), valid)

        loss_GAN = (loss_GAN_AB + loss_GAN_BA) / 2

        # (6) Cycle loss를 계산함
        recov_A = G_BA(fake_B) # G_BA로 가짜 이미지 fake_B에서 새로운 가짜 이미지 recov_A를 생성
        loss_cycle_A = criterion_cycle(recov_A, real_A) # recov_A 를 실제 이미지 real_A 와 비교해 L1Loss 계산
        recov_B = G_AB(fake_A)
        loss_cycle_B = criterion_cycle(recov_B, real_B)

        loss_cycle = (loss_cycle_A + loss_cycle_B) / 2

        # (7) 앞서 계산한 loss 를 총합하여 생성자의 전체 손실 함수를 계산하고 생성자의 가중치를 업데이트함
        loss_G = loss_GAN + lambda_cyc * loss_cycle + lambda_id * loss_identity

        loss_G.backward()
        optimizer_G.step()

        # (8) 판별자 D_A의 가중치를 업데이트 하는 과정
        # 실제 이미지 real_A는 valid로 분류하고 생성한 fake_A는 fake로 분류함, 학습을 위해 zero_grad
        optimizer_D_A.zero_grad()

        # (9) 판별자 D_A가 '진짜'라고 판별하는 경우, 실제 이미지 real_A의 MSE 손실함수를 계산함
        loss_real = criterion_GAN(D_A(real_A), valid)

        # (10) 판별자 D_A가 '가짜'라고 판별하는 경우, 가짜 이미지 fake_A의 MSE 손실함수를 계산함
        fake_A_ = fake_A_buffer.push_and_pop(fake_A)
        # fake_A의 가중치는 업데이트 가능한 상태이므로 detach() 함수로 값만 복사해옴
        loss_fake = criterion_GAN(D_A(fake_A_.detach()), fake)

        # (11) 9, 10 에서 계산한 손실 함수를 모두 합한 후 D_A의 가중치를 업데이트함
        loss_D_A = (loss_real + loss_fake) / 2

        loss_D_A.backward()
        optimizer_D_A.step()

        # (12) 8과 동일
        optimizer_D_B.zero_grad()

        # (13) 9와 동일
        loss_real = criterion_GAN(D_B(real_B), valid)

        # (14) 10과 동일
        fake_B_ = fake_B_buffer.push_and_pop(fake_B)
        loss_fake = criterion_GAN(D_B(fake_B_.detach()), fake)

        # (15) 11과 동일
        loss_D_B = (loss_real + loss_fake) / 2

        loss_D_B.backward()
        optimizer_D_B.step()

        loss_D = (loss_D_A + loss_D_B) / 2

        # (16) 에포크와 배치 사이즈로 남은 시간을 출력하기 윈한 코드
        batches_done = epoch * len(dataloader) + i
        batches_left = n_epochs * len(dataloader) - batches_done
        time_left = datetime.timedelta(seconds=batches_left * (time.time() - prev_time))
        prev_time = time.time()

        # (17) 에포크와 배치 사이즈로 남은 시간을 출력하기 윈한 코드
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

        # (18) 특정 에포크 간격마다 샘플로 생성한 이미지를 저장함
        if batches_done % sample_interval == 0:
            sample_images(batches_done)

    # (19) 생성자, 판별자의 learning rate(학습률) 스케줄러를 업데이트함
    lr_scheduler_G.step()
    lr_scheduler_D_A.step()
    lr_scheduler_D_B.step()

    # (20) 모델 가중치를 저장함
    if checkpoint_interval != -1 and epoch % checkpoint_interval == 0:
        torch.save(G_AB.state_dict(), "checkpoint_reference/%s/G_AB_%d.toon" % (dataset_name, epoch))
        torch.save(G_BA.state_dict(), "checkpoint_reference/%s/G_BA_%d.toon" % (dataset_name, epoch))
        torch.save(D_A.state_dict(), "checkpoint_reference/%s/D_A_%d.toon" % (dataset_name, epoch))
        torch.save(D_B.state_dict(), "checkpoint_reference/%s/D_B_%d.toon" % (dataset_name, epoch))