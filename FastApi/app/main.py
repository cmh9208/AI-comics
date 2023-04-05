import os
import sys
from http.client import HTTPException
from fastapi import FastAPI, File, UploadFile, APIRouter, HTTPException
import openai
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pyttsx3
from PIL import Image
import io
import os
import base64
from fastapi.staticfiles import StaticFiles
from app.gan_service import create_fake_image, create_fake_standard_image
from app.gan_vid_service import create_fake_img_and_vid

# 웹소켓 양방향 통신 비동기 방식
import asyncio
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from starlette.responses import JSONResponse
from starlette.websockets import WebSocket
import cv2
import numpy as np
import subprocess
from typing import List
from fastapi.responses import FileResponse
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, Request

router = APIRouter()
app = FastAPI()


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


class UserInput(BaseModel):
    user_content: str


openai.api_key = "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"

@app.post("/gpt")
async def get_response(user_input: UserInput):
    messages = []
    messages.append({"role": "user", "content": f"{user_input}"})  # 사용자의 질문을 리스트에 추가
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    gpt_content = completion.choices[0].message["content"].strip()  # 챗봇의 답변을 변수에 저장
    messages.append({"role": "assistant", "content": f"{gpt_content}"})  # 챗봇 답변을 리스트에 추가

    print(f"GPT : {gpt_content}")  # 챗봇의 답변 출력

    return {"response": gpt_content}


@app.post("/face")
async def process_image(image: UploadFile = File(...)):

    file_location = os.path.join("user_image/", image.filename)

    # 받은 이미지를 user_image 폴더에 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    try:
        # 받은 이미지를 처리하고 result_gan_vid/fake_face_%s 로 저장 시킨다
        create_fake_image(file_location)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="이미지 변환 실패. 다시 업로드해 주세요.")

    # create_fake_image() 함수가 저장한 이미지 파일 열기
    with open("result_gan_vid/fake_face_%s" % image.filename, "rb") as img_file:
        image_bytes = img_file.read()

    # 바이트 스트림을 base64 인코딩
    result = base64.b64encode(image_bytes).decode()

    return {"data": result}












@app.post("/video")
async def process_video(image: UploadFile = File(...)):
    file_location = os.path.join("user_image/", image.filename)

    # 받은 이미지를 user_image 폴더에 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())
    try:
        # 받은 이미지를 mp4 비디오로 변환하고, 생성된 비디오 파일 이름 받아옴
        # create_fake_img_and_vid() 함수는 사용자 한테서 받은 이미지 이름이 test.jpg 일때 fake_test.jpg.mp4 이름을 반환 하도록 되어있음.
        loop = asyncio.get_event_loop()
        video_name = await loop.run_in_executor(None, lambda: create_fake_img_and_vid(file_location))

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="이미지 변환 실패. 다시 업로드해 주세요.")

    return JSONResponse(content={"data": await video_name})


# 바이트 스트림 방식은 스트리밍 방식보다 서버 부하가 적다
@app.post("/test")
async def get_video(request: Request):
    try:
        body = await request.json()
        file_name = body.get('file_name')
        with open("result_gan_vid/fake_%s.mp4" % file_name, "rb") as video_file:
            # 비디오 파일을 바이트 스트림으로 변환
            video_bytes = video_file.read()

        # 바이트 스트림을 base64 인코딩
        result = base64.b64encode(video_bytes).decode()

        # 클라이언트 측에 json 형식으로 반환
        return {"data": result}
    except Exception as e:
        print(e)
        return {"error": "비디오 파일을 불러오는 중에 오류가 발생했습니다."}



# 스트리밍 방식
# @app.get("/test")
# async def get_video():
#     file_path = "result_gan_vid/fake_kimgoeun.jpg.mp4"
#     return StreamingResponse(open(file_path, "rb"), media_type="video/mp4")







@app.post("/standard")
async def process_image(image: UploadFile = File(...)):

    file_location = os.path.join("user_image/", image.filename)

    # 받은 이미지를 user_image 폴더에 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    try:
        # 받은 이미지를 처리하고 result_gan_vid/standard_fake_%s 로 저장 시킨다
        await create_fake_standard_image(file_location)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="이미지 변환 실패. 다시 업로드해 주세요.")

    # create_fake_standard_image() 함수가 저장한 이미지 파일 열기
    with open("result_gan_vid/standard_fake_%s" % image.filename, "rb") as img_file:
        image_bytes = img_file.read()

    # 바이트 스트림을 base64 인코딩
    result = base64.b64encode(image_bytes).decode()

    return {"data": result}











@app.post("/toon")
async def toon_image(image: UploadFile = File(...)):

    file_location = os.path.join("user_image/", image.filename)

    # 받은 이미지를 user_image 폴더에 저장
    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    try:
        # 받은 이미지를 처리하고 result_gan_vid/standard_fake_%s 로 저장 시킨다
        await create_fake_standard_image(file_location)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="이미지 변환 실패. 다시 업로드해 주세요.")

    # create_fake_standard_image() 함수가 저장한 이미지 파일 열기
    with open("result_gan_vid/standard_fake_%s" % image.filename, "rb") as img_file:
        image_bytes = img_file.read()

    # 바이트 스트림을 base64 인코딩
    result = base64.b64encode(image_bytes).decode()

    return {"data": result}