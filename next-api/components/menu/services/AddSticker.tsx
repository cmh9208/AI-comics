import { useState } from "react";
import htmlToImage from "html-to-image";

const IndexPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sticker, setSticker] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setSticker(null); // 파일이 변경될 때마다 스티커 상태를 초기화합니다.
  };

  const handleStickerClick = (sticker: string) => {
    setSticker(`${process.env.PUBLIC_URL}/stickers${sticker}`);
  };

  const handleDownloadClick = async () => {
    if (file && sticker) {
      const imageContainer = document.createElement("div");
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      imageContainer.appendChild(image);
      const stickerImage = document.createElement("img");
      stickerImage.src = sticker;
      stickerImage.style.position = "absolute";
      stickerImage.style.top = "0";
      stickerImage.style.left = "0";
      imageContainer.appendChild(stickerImage);
      const imageBlob = await htmlToImage.toPng(imageContainer);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(new Blob([imageBlob], { type: "image/png" }));
      downloadLink.download = "image.png";
      downloadLink.click();
    }
  };

  return (
    <div>
      <h1>Upload a photo and add a sticker!</h1>
      <div>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>
      <div>
        <button onClick={() => handleStickerClick("/sticker1.png")}>
          Sticker 1
        </button>
        <button onClick={() => handleStickerClick("/sticker2.png")}>
          Sticker 2
        </button>
        <button onClick={() => handleStickerClick("/stickers/sticker3.png")}>
          Sticker 3
        </button>
      </div>
      <div id="image-container">
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="uploaded image"
            style={{ maxWidth: "100%" }}
          />
        )}
        {sticker && (
          <img
            src={sticker}
            alt="selected sticker"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
      </div>
      <div>
        <button onClick={handleDownloadClick} disabled={!file || !sticker}>
          Download
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
