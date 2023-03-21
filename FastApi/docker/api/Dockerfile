FROM python:3.9

WORKDIR /app
ADD requirements.txt .
RUN apt-get update && apt-get install -y libgl1-mesa-glx # cv2 설치를 위한
RUN pip install --trusted-host pypi.python.org -r requirements.txt
RUN apt-get update && apt-get install -y libespeak1
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]




#
#FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
#
#WORKDIR /app
#
#COPY requirements.txt .
#
#RUN pip install -r requirements.txt
#
#COPY . .
#
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# compose up 으로 설치하기전에 미리 따로 설치해놔도 되는가?
#다만, 이 방법은 호스트 머신과 컨테이너가 서로 다른 운영 체제를 사용하는 경우 문제가 발생할 수 있습니다.
# 내 호스트 머신은 윈도우 이므로 컨테이너가 어떤 운영체제인지 알기

#conda install -c conda-forge dlib==19.22.99
#conda-forge dlib
#pywin32 ; sys.platform=='win32' # pywin32 를 윈도우 환경에만 설치되게끔