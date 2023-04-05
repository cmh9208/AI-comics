import { useState } from "react";
import axios from "axios";

function GanStandard() {
  const [url, setUrl] = useState<string>(
    "https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/"
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const MAX_SIZE = 1000;
  const RESIZED_WIDTH = 900;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setErrorMessage(null); // 에러 메시지 초기화

    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = async () => {
      let width = img.width;
      let height = img.height;
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
      // 이미지 축소
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      const resizedFile = await new Promise<File>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], image.name, {
              type: image.type,
              lastModified: Date.now(),
            });
            resolve(file);
          } else {
            reject(new Error("이미지 변환 실패"));
          }
        }, "image/jpeg");
      });

      const formData = new FormData();
      formData.append("image", resizedFile);

      try {
        const response = await axios.post<{ data: string }>(
          "http://api.choiminho.co.kr/standard",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const imageData = response.data.data;
        setResizedImage(`data:image/jpeg;base64,${imageData}`);
      } catch (error) {
        console.log(error);
        setErrorMessage(
          "변환 실패 다시 업로드해 주세요.\n이미지 업로드 가이드를 참고 해주세요"
        ); // 실패 메시지 설정
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreviewImage(null);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 800, boxShadow: '0 0 5px 5px rgba(140, 210, 100, 0.5)'}}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", width: 400, height: 400}}>
              <h2>원본 이미지</h2>
              {previewImage && !isLoading && !errorMessage && (
                <div>
                  <img style={{ width: 400 }} src={previewImage} alt="Preview" />
                </div>
              )}
           
              {isLoading && (
                <div>
                  <img style={{ width: 300 }} src={`${url}ai_logo.gif`} alt="logo" />
                  <h3>변환 중입니다!</h3>
                </div>
              )}
              {errorMessage && (
                <div>
                  <p>{errorMessage}</p>
                  <button onClick={() => window.location.reload()}>새로고침</button>
                </div>
              )}
            </td>


            <td style={{ textAlign: "center", width: 400, height: 400}}>
              <h1>만화 사진 만들기</h1>
              <p style={{fontSize: '20px', color: "rgba(140, 210, 100, 1)", fontWeight: "bold"}}>사용 설명</p>
              <p>얼굴만 추출하지 않고 사진 전체를 만화로 변환합니다</p>
              <p>너무 큰 이미지는 900픽셀로 축소된 결과를 제공합니다</p>
              <br/><br/><br/><br/><br/><br/>
              <form onSubmit={handleSubmit}>
                <input  style={{
                      backgroundColor: "rgba(140, 210, 100, 0.7)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }} type="file" accept="image/*" onChange={handleImageChange} />
                    <br/><br/><br/>
                <button style={{
                      backgroundColor: "rgba(140, 210, 100, 0.7)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }} type="submit">변환하기</button>
              </form>
            </td>
            <td style={{ textAlign: "center", width: 400, height: 400}}>
              <h2>만화 이미지</h2>
              {resizedImage && (
                <div>
                  <img style={{ width: 400 }} src={resizedImage} alt="Resized" />
                  <br /><br />
                  <a
                    href={resizedImage}
                    download
                    style={{
                      backgroundColor: "rgba(140, 210, 100, 0.7)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textDecoration: "none",
                    }}
                  >
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
}

export default GanStandard;



