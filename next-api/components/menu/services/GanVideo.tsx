import { useState, useEffect } from "react";
import axios from "axios";

const GanVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const { width, height } = img;
          if (width >= 1000 || height >= 1000) {
            const canvas = document.createElement("canvas");
            const ratio = width / height;
            let newWidth = 0;
            let newHeight = 0;
            if (width > height) {
              newWidth = 900;
              newHeight = Math.floor(newWidth / ratio);
            } else {
              newHeight = 900;
              newWidth = Math.floor(newHeight * ratio);
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const newFile = dataURLtoFile(canvas.toDataURL("image/jpeg"), selectedFile.name);
              setFile(newFile);
              setFilename(newFile.name);
              setProgress(0);
              setIsCompleted(false);
              setImageSrc(canvas.toDataURL());
            }
          } else {
            setFile(selectedFile);
            setFilename(selectedFile.name);
            setProgress(0);
            setIsCompleted(false);
            setImageSrc(reader.result as string);
          }
        };
      };
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file, filename);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= 2500) {
          clearInterval(interval);
          setProgress(100);
          setIsCompleted(true);
        } else {
          setProgress(Math.floor((elapsedTime / 2500) * 100));
        }
      }, 100);
      try {
        const response = await axios.post("http://api.choiminho.co.kr/video", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setIsUploading(false);
        clearInterval(interval);
        setIsCompleted(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchVideo = async () => {
    const file_name = filename; // 클라이언트가 원하는 파일 이름
    try {
      const response = await axios.post("http://api.choiminho.co.kr/test", { file_name });
      const base64Data = response.data.data;
      const blob = await fetch(`data:video/mp4;base64,${base64Data}`).then((res) => res.blob());
      setVideoSrc(URL.createObjectURL(blob));
      setError("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError("비디오를 불러오는 중에 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoSrc) {
      const video = document.createElement("video");
      video.src = videoSrc;
      video.load();
    }
  }, [videoSrc]);

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = videoSrc;
    downloadLink.download = "fake_video.mp4";
    downloadLink.click();
  };


  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 800, boxShadow: '0 0 5px 5px rgba(0, 50, 200, 0.3)'}}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", width: 400, height: 400}}>
            <h2>원본 이미지</h2>
              {imageSrc && (
                <div>
                  <img src={imageSrc} alt="uploaded file" style={{maxWidth: "100%", maxHeight: 550 }} />
                </div>
              )}
            </td>

            <td style={{ textAlign: "center", width: 400, height: 400}}>
            <h1>만화 영상 만들기</h1>
              <p style={{fontSize: '20px', color: "rgba(0, 50, 200, 0.7)", fontWeight: "bold"}}>사용 설명</p>
              <p>이미지를 움직이는 만화 영상으로 만듭니다</p>
              <p>서버는 CPU 환경 이므로 약 5분의 시간이 소요 됩니다😂</p>
              <p>다운 받은 영상은 챗봇 아바타로 사용할 수 있습니다</p>
              <br/><br/><br/>
              {error && <div style={{color: 'red'}}>{error}</div>}
              <div>
              <input style={{
                      backgroundColor: "rgba(0, 50, 200, 0.3)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }}type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <br/><br/>

              <div>
              <button style={{
                      backgroundColor: "rgba(0, 50, 200, 0.3)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }}onClick={handleUpload} disabled={isUploading}>
                    변환하기
              </button>
              </div>
              <br/>

              <div>
                {isUploading && <progress style={{width: 350, height: 50, color: "rgba(0, 50, 200, 0.3)"}} value={progress} max={100} />}<br/><br/>
                {isCompleted && (
                  <span>
                    <button style={{
                      backgroundColor: "rgba(0, 50, 200, 0.3)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }}onClick={fetchVideo}>결과 보기</button>
                  </span>
                )}
              </div>
            </td>

            <td style={{ textAlign: "center", width: 400, height: 400}}>
            <h2>페이크 영상</h2>
            {videoSrc && (
                  <div>
                  <video style={{width:400}} controls>
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                  <br /><br />
                  <a href={videoSrc} download="fake_video.mp4" style={{
                    backgroundColor: "rgba(0, 50, 200, 0.3)",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                    textDecoration: "none",
                  }}>
                    다운로드
                  </a>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GanVideo;
