import cv2
import os

class DataPreprocessing(object):
    def __init__(self, video_path):
        self.video = video_path

    # 불러온 비디오 화인
    def get_video(self):
        video = cv2.VideoCapture(self.video)
        if not video.isOpened():
            print("Could not Open :", self.video)
            exit(0)
        else: print("가져온 비디오" , self.video)

        return video

    # 불러온 비디오 파일의 정보 출력
    def video_spec(self):
        video = self.get_video()
        length = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = video.get(cv2.CAP_PROP_FPS)

        print("length :", length)
        print("width :", width)
        print("height :", height)
        print("fps :", fps)

        return fps

    # 프레임을 저장할 디렉토리를 생성
    def create_directory(self):
        try:
            if not os.path.exists(video_path[:-4]):
                os.makedirs(video_path[:-4])
        except OSError:
            print ('Error: Creating directory. ' + video_path[:-4])
        count = 0

        return count

    # 이미지로 저장
    def save_img(self):
        video = self.get_video()
        fps = self.video_spec()
        count = self.create_directory()

        while (video.isOpened()):
            ret, image = video.read()
            if (int(video.get(1)) % (fps*6) == 0):  # fps 한번이 1초가 됨
                cv2.imwrite(video_path[:-4] + "/frame%d.jpg" % count, image)
                print('Saved frame number :', str(int(video.get(1))))
                count += 1

        video.release() # 메모리를 해제


menu = ["종료",
        "비디오 로드확인",
        "비디오 정보출력",
        "이미지로 저장하기",
        ]

start_lambda = {"1": lambda x: x.get_video(),
                "2": lambda x: x.video_spec(),
                "3": lambda x: x.save_img(),
                }

if __name__ == '__main__':
    while True:
        [print(f"{i}번 메뉴: {j}") for i, j in enumerate(menu)]
        key = input("메뉴선택: ")
        print("#" * 50)

        video_path = "Chihiro_Totoro_Howl_Ponyo_Laputa.mp4"

        dp = DataPreprocessing(video_path)
        if key == "0":
            print("종료")
            break

        try: start_lambda[key](dp)
        except:
            print("error")




