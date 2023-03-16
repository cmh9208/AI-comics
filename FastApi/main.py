import os
from fastapi import FastAPI, File, UploadFile
from PIL import Image

app = FastAPI()

@app.post("/image-upload")
async def upload(image: UploadFile = File(...)):
    # 이미지 저장 경로를 images 폴더에 지정
    save_path = os.path.join("images", image.filename)
    with open(save_path, "wb") as buffer:
        buffer.write(await image.read())

    # 이미지 전처리 수행
    img = Image.open(save_path)
    img.thumbnail((img.size[0] // 2, img.size[1] // 2))
    img.save(save_path)

    # 클라이언트가 이미지에 접근할 수 있는 URL을 반환
    return {"url": f"http://localhost:8000/images/{image.filename}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
