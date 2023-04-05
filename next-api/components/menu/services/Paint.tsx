import React, { useRef, useState } from "react";

const DrawingBoard = () => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);

        // 이미지 크기 계산 후 canvas 요소 크기 조정
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            const context = canvasRef.current.getContext("2d");
            if (context) {
              context.drawImage(img, 0, 0, img.width, img.height);
            }
          }
        };
      };
    }
  };

  const handleDownloadClick = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      isDrawingRef.current = true;
      lastXRef.current = event.nativeEvent.offsetX;
      lastYRef.current = event.nativeEvent.offsetY;
    }
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        context.strokeStyle = "red";
        context.lineWidth = 10; // 굵기 조절
        context.beginPath();
        context.moveTo(lastXRef.current, lastYRef.current);
        context.lineTo(x, y);
        context.stroke();
        lastXRef.current = x;
        lastYRef.current = y;
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageSrc && <img src={imageSrc} />}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseMove={handleCanvasMouseMove}
      />
      <button onClick={handleDownloadClick}>Download</button>
    </div>
  );
};

export default DrawingBoard;
