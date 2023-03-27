import os
from fastapi import FastAPI, File, UploadFile, APIRouter
import openai
from pydantic import BaseModel
from starlette.responses import JSONResponse
from .gan_vid_service import create_fake_img_and_vid
from fastapi.middleware.cors import CORSMiddleware
import pyttsx3
from PIL import Image
import io
import base64

router = APIRouter()
app = FastAPI()

openai.api_key = ""

class UserInput(BaseModel):
    user_content: str


@app.post("/gpt")
async def get_response(user_input: UserInput):

    messages = []
    messages.append({"role": "user", "content": f"{user_input}"})  # 사용자의 질문을 리스트에 추가
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    gpt_content = completion.choices[0].message["content"].strip()  # 챗봇의 답변을 변수에 저장
    messages.append({"role": "assistant", "content": f"{gpt_content}"})  # 챗봇 답변을 리스트에 추가

    print(f"GPT : {gpt_content}")  # 챗봇의 답변 출력

    return {"response": gpt_content}


# CORS 설정 추가
origins = ["http://localhost",
           "http://localhost:3000",
           "http://api.choiminho.co.kr",
           "https://api.choiminho.co.kr",
           "http://minho-choi.com.s3-website.ap-northeast-2.amazonaws.com",
           "http://minho-choi.com.s3-website.ap-northeast-2.amazonaws.com/menu/services/chatbot",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "user_image/"

# 저장된 파일 전송 성공 하지만 생성과 동시에 전송 실패, 생성을 먼저하고 저장된 파일을 따로 요청하는 차선책 생각중
@app.post("/image")
async def process_image(image: UploadFile = File(...)):
    print(image.filename) # 7.jpg
    file_location = os.path.join(UPLOAD_FOLDER, image.filename)

    # 받은 이미지를 user_image 폴더에 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    # create_fake_img_and_vid() 함수가 받은 이미지를 app/result_gan_vid/face_%s 로 저장 시킨다
    create_fake_img_and_vid(file_location)

    # create_fake_img_and_vid() 함수가 저장한 이미지 파일 열기
    with open("result_gan_vid/face_%s" % image.filename, "rb") as img_file:
        # print(image.filename) # 출력결과: 'result_gan_vid/face_6.jpg' 이렇게 나오면 안되고 face_6.jpg 만 나와야함
        image_bytes = img_file.read()

    a = base64.b64encode(image_bytes).decode()

    # 바이트 스트림을 base64 인코딩하여 반환
    return {"data": a}


@app.post("/image2")
async def process_image(image: UploadFile = File(...)):
    # 이미지를 읽어들여 PIL Image 객체로 변환
    image_bytes = await image.read()
    image = Image.open(io.BytesIO(image_bytes))

    # 이미지 크기를 절반으로 축소
    resized_image = image.resize((image.width // 2, image.height // 2))

    # 축소된 이미지를 파일로 저장하고, 바이트 스트림으로 변환하여 반환
    with io.BytesIO() as output:
        resized_image.save(output, format="JPEG")
        contents = output.getvalue()

        # 이미지를 파일로 저장
        with open("resized_image.jpg", "wb") as f:
            f.write(contents)

        # 바이트 스트림을 base64 인코딩하여 반환
        a = base64.b64encode(contents).decode()
        print(a)
        print(type(a))
        return {"data": a}

# MP4 비디오 파일을 읽고 base64 문자열로 인코딩

#     with open("output.mp4", "rb") as f:
#         video_bytes = f.read()

#     video_base64 = base64.b64encode(video_bytes).decode()

# return {"video": video_base64}



@app.get("/test")
async def say_hello():
    return {"response": "!!!!!!!!!!! TEST !!!!!!!!!!!"}
#
#
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="localhost", port=8000)
#
#
# UPLOAD_FOLDER = "result_gan_vid/"
#
# # 웹 서비스 (만화 이미지, 영상 만들기)
# @app.post("/gan_vid_service")
# async def gan_vid_service(image: UploadFile = File(...)):
#     file_location = os.path.join(UPLOAD_FOLDER, image.filename)
#     # 받은 이미지를 저장
#     with open(file_location, "wb") as buffer:
#         buffer.write(await image.read())
#
#     # 얼굴 추출 이미지, 만화 이미지, 만화 영상 3가지를 만들고 result_gan_vid 에 저장 해주는 함수
#     create_fake_img_and_vid(file_location)
#
#     # 얼굴 추출 이미지, 만화 이미지, 만화 영상 3개를 리턴
#     urls = {
#         "face_url": f"http://api.choiminho.co,kr/result_gan_vid/face_{image.filename}",
#         "fake_face_url": f"http://api.choiminho.co,kr/result_gan_vid/fake_face_{image.filename}",
#         "fake_vid_url": f"http://api.choiminho.co,kr/result_gan_vid/fake_{image.filename}.mp4"
#     }
#     return urls