import os
from fastapi import FastAPI, File, UploadFile, APIRouter
import openai
import pyttsx3
from starlette.responses import JSONResponse

from app.gan_vid_service import create_fake_img_and_vid
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()
app = FastAPI()
engine = pyttsx3.init()

# 음성 속도를 300으로 설정
engine.setProperty('rate', 250)
openai.api_key = "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"
messages = []

# 클라이언트의 텍스트를 받아 챗봇의 답변을 리턴
@app.post("/gpt")
async def gpt(user_content: str):

    if not user_content:
        return {"error": "Please provide some input."}

    messages.append({"role": "user", "content": f"{user_content}"})
    try:
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
        gpt_content = completion.choices[0].message["content"].strip()
    except Exception as e:
        return {"error": str(e)}

    messages.append({"role": "assistant", "content": f"{gpt_content}"})

    # engine.say(gpt_content)
    # engine.stop()
    return JSONResponse(content={"response": gpt_content})


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
#         "face_url": f"http://localhost:8000/result_gan_vid/face_{image.filename}",
#         "fake_face_url": f"http://localhost:8000/result_gan_vid/fake_face_{image.filename}",
#         "fake_vid_url": f"http://localhost:8000/result_gan_vid/fake_{image.filename}.mp4"
#     }
#     return urls