import tensorflow_hub as hub
import tensorflow as tf
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

### 딥러닝 활용 이미지 확대 시 해상도 유지 ###

# 모델 로드
def size_up(image):
    base_model = hub.load('https://tfhub.dev/captain-pool/esrgan-tf2/1')

    input = tf.keras.layers.Input(shape=(None, None, 3), dtype=tf.float32)
    net = hub.KerasLayer(base_model)(input)
    model = tf.keras.models.Model(input, net)

    # 모델 예측
    image = Image.open(image)

    plt.imshow(image)
    plt.show()

    plt.imshow(image.resize((1024, 1024)))
    plt.show()

    image = np.array(image) #이미지 타입을 넘파이 타입으로 변환
    x_test = np.array([image])
    x_test = x_test.astype(dtype=np.float32)

    y_predict = model.predict(x_test)

    image = y_predict[0]
    image = image.astype(np.uint8)

    image = np.array(image) #이미지 타입을 넘파이 타입으로 변환
    output_image = Image.fromarray(image)
    output_image.save("nnnnnsds2.jpg", "JPEG")
    img = Image.open('nnnnnsds2.jpg')
    plt.imshow(image)
    plt.show()
    return img

if __name__ == '__main__':
    image = "nnnnn.jpg"
    size_up(image)


