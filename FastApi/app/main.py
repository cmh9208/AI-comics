import os
from fastapi import FastAPI, File, UploadFile, APIRouter
import openai

from starlette.responses import JSONResponse

from .gan_vid_service import create_fake_img_and_vid
from fastapi.middleware.cors import CORSMiddleware
import pyttsx3


router = APIRouter()
app = FastAPI()

openai.api_key = ""

user_content = "안녕"
def chat_gpt(user_content):
    engine = pyttsx3.init()

    # 음성 속도를 300으로 설정
    engine.setProperty('rate', 250)
    messages = []
    while True:
        # user_content = input(f"user : ")
        messages.append({"role": "user", "content": f"{user_content}"})  # 사용자의 질문을 리스트에 추가
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
        gpt_content = completion.choices[0].message["content"].strip()  # 챗봇의 답변을 변수에 저장
        messages.append({"role": "assistant", "content": f"{gpt_content}"})  # 챗봇 답변을 리스트에 추가
        if user_content == "대화 종료":
            print("대화가 종료 됩니다.")
            return gpt_content
            break
        print(f"GPT : {gpt_content}")  # 챗봇의 답변 출력
        engine.say(gpt_content)
        engine.runAndWait()  # 답변이 끝날때 까지 대기
        engine.stop()  # 대답 출력 중지
        return gpt_content




@app.get("/gpt")
async def gpt():
    return {"message": chat_gpt(user_content)}




# CORS 설정 추가
origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
async def say_hello():
    return {"message": "hahahahahahahahahahahahahahahahahahaha!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"}






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)


# return {"url": f"http://localhost:8000/result_gan_vid/fake_face_{image.filename}"}




UPLOAD_FOLDER = "result_gan_vid/"

# 웹 서비스 (만화 이미지, 영상 만들기)
@app.post("/gan_vid_service")
async def gan_vid_service(image: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_FOLDER, image.filename)
    # 받은 이미지를 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    # 얼굴 추출 이미지, 만화 이미지, 만화 영상 3가지를 만들고 result_gan_vid 에 저장 해주는 함수
    create_fake_img_and_vid(file_location)

    # 얼굴 추출 이미지, 만화 이미지, 만화 영상 3개를 리턴
    urls = {
        "face_url": f"http://localhost:8000/result_gan_vid/face_{image.filename}",
        "fake_face_url": f"http://localhost:8000/result_gan_vid/fake_face_{image.filename}",
        "fake_vid_url": f"http://localhost:8000/result_gan_vid/fake_{image.filename}.mp4"
    }
    return urls






