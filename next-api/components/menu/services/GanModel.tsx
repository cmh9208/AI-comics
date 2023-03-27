// import React, { useState } from 'react';
// import Image from "next/image";

// const GanModel = () => {
//   const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/");

//   return (
//     <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 800}}>
//       <table>
//         <tbody>
//           <tr>
//             <td style={{ textAlign: 'center' }}>
//               <h1>준비 중입니다.</h1>
//               <div>
//                 <img style={{ width: 200 }} src={`${url}ai_logo.gif`} alt="logo_gif" />
//               </div>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GanModel;



import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post<{ data: string }>(
        "http://api.choiminho.co.kr/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageData = response.data.data;
      setResizedImage(`data:image/jpeg;base64,${imageData}`);
    } catch (error) {
      console.log(error);
    }
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Resize Image</button>
      </form>
      {previewImage && (
        <div>
          <h2>Preview:</h2>
          <img src={previewImage} alt="Preview" />
        </div>
      )}
      {resizedImage && (
        <div>
          <h2>Resized Image:</h2>
          <img src={resizedImage} alt="Resized" />
        </div>
      )}
    </div>
  );
}

export default App;
