import React, { useState, ChangeEvent } from "react";

const GanVidService = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [faceUrl, setFaceUrl] = useState<string>("");
  const [fakeFaceUrl, setFakeFaceUrl] = useState<string>("");
  const [fakeVidUrl, setFakeVidUrl] = useState<string>("");

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files![0]);
  };

  const fileUploadHandler = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/gan_vid_service", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { face_url, fake_face_url, fake_vid_url } = await response.json();
        setFaceUrl(face_url);
        setFakeFaceUrl(fake_face_url);
        setFakeVidUrl(fake_vid_url);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={fileUploadHandler}>Upload</button>
      <div>
        <h3>Generated Images and Video:</h3>
        {faceUrl && <img src={faceUrl} alt="Extracted Face" />}
        {fakeFaceUrl && <img src={fakeFaceUrl} alt="Generated Face" />}
        {fakeVidUrl && (
          <video controls>
            <source src={fakeVidUrl} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export default GanVidService;
