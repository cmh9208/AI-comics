import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { NextPage } from 'next'
import axios from 'axios'
import Link from 'next/link';



const SERVER = process.env.NEXT_PUBLIC_SERVER

const AnUploadPage: NextPage = () =>{
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList as never[])
  };
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('files', images[0]);
    try {
      const response = axios({
        method: "post",
        url: `${SERVER}/images/upload`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch(error) {
      console.log(error)
    }
  }
  /**
  const onImageUpload = () => {
    const formData = new FormData();
    alert(' formData >> '+formData)
    formData.append('files', images[0])
    try{
      axios.post(`${SERVER}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: "JWT fefege..."
      }
  })
  .then((response) => {
    // 응답 처리
  })
  .catch((error) => {
    // 예외 처리
  })}
  catch(error){console.log(error)}}
 */
  return (
    <form onSubmit={handleSubmit}> 
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      
      <input type="submit" value="Upload File" />
      
      </div>
    </form>
  );
}

export default AnUploadPage