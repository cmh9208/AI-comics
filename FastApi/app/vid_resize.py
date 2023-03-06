import cv2  # OpenCV(실시간 이미지 프로세싱) 모듈

# 동영상 파일 경로 또는 카메라 index 번호
video_path = "user_image/fake_iu.jpg.mp4"

# VideoCapture : 동영상 파일 또는 카메라 열기
capture = cv2.VideoCapture(video_path)

while True:
    # read : 프레임 읽기
    # [return]
    # 1) 읽은 결과(True / False)
    # 2) 읽은 프레임
    retval, frame = capture.read()

    # 읽은 프레임이 없는 경우 종료
    if not retval:
        break

    # resize : 이미지 크기 변환
    # 1) 변환할 이미지
    # 2) 변환할 이미지 크기(가로, 세로)
    # - interpolation : 보간법 지정
    #   - 보간법 : 알려진 데이터 지점 내에서 새로운 데이터 지점을 구성하는 방식
    #   - cv2.INTER_NEAREST : 최근방 이웃 보간법
    #   - cv2.INTER_LINEAR(default) : 양선형 보간법(2x2 이웃 픽셀 참조)
    #   - cv2.INTER_CUBIC : 3차 회선 보간법(4x4 이웃 픽셀 참조)
    #   - cv2.INTER_LANCZOS4 : Lanczos 보간법(8x8 이웃 픽셀 참조)
    #   - cv2.INTER_AREA : 픽셀 영역 관계를 이용한 resampling 방법으로 이미지 축소시 효과적
    resize_frame = cv2.resize(frame, (512, 512), interpolation=cv2.INTER_CUBIC)

    # 프레임 출력
    cv2.imshow("resize_frame", resize_frame)

    # 'q' 를 입력하면 종료
    if cv2.waitKey(50) & 0xFF == ord('q'):
        break

# 동영상 파일 또는 카메라를 닫고 메모리를 해제
capture.release()

# 모든 창 닫기
cv2.destroyAllWindows()