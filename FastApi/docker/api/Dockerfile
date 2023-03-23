FROM python:3.9

WORKDIR /app
ADD requirements.txt .
RUN apt-get update && apt-get install -y libgl1-mesa-glx # cv2 설치를 위한
RUN pip install --trusted-host pypi.python.org -r requirements.txt
RUN apt-get update && apt-get install -y libespeak1 #TTS
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
# apt-get install libopenblas-dev --- for dlib
# apt-get install portaudio19-dev
# pip install pyaudio
# apt-get install alsa-utils --- 리눅스 오디오 파일 재생
# apt-get install libasound2-dev --- ALSA 라이브러리
# apt-get update