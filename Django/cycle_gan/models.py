from torch import nn
import torch.nn.functional as F

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

        # Initial convolution block(초기 컨벌루션 블록 선언)
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