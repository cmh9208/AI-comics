import React, { useState } from 'react'
import Link from 'next/link';
import { AlertTitle } from '@mui/material';



const Home: React.FC = () => {
 const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 3700}} >
    <table>
      <tbody>

        <tr>
          <td style={{textAlign: 'center'}}>
            <h5>원본 이미지</h5>
            <img style={{ width: 300 }} src={`${url}iu1.jpg`} alt="logo" />
          </td>
          <td style={{textAlign: 'center'}}>
            <h5>만화 이미지</h5>
            <img style={{ width: 300 }} src={`${url}iu2.jpg`} alt="logo" />
          </td>
          <td style={{textAlign: 'center'}}>
            <h5>페이크 영상</h5>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_iu.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}na1.jpg`} alt="logo" />
          </td>
          <td style={{textAlign: 'center'}}>
           <img style={{ width: 300 }} src={`${url}nana2.jpg`} alt="logo" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}nana.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr style={{ height: 100, textAlign: 'center'}} ></tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}2.jpg`} alt="logo" />
          </td>
          <td style={{textAlign: 'center'}}>
           <img style={{ width: 300 }} src={`${url}22.jpg`} alt="logo" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}22.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}3.jpg`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}33.jpg`} alt="fake_nayeon" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}33.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}1.png`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}11.jpg`} alt="fake_nayeon" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}11.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr style={{ height: 100, textAlign: 'center'}} ></tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 400 }} src={`${url}555.jpg`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 400 }} src={`${url}5555.jpg`} alt="fake_nayeon" />
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 400 }} src={`${url}666.jpg`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 400 }} src={`${url}6666.jpg`} alt="fake_nayeon" />
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}ja1.jpg`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}js2.jpg`} alt="fake_nayeon" />
          </td>
        </tr>

        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}777.jpg`} alt="fake_nayeon" />
          </td>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}7777.jpg`} alt="fake_nayeon" />
          </td>
        </tr>
        
        <tr>
          <td style={{textAlign: 'center'}}>
            <img style={{ width: 300 }} src={`${url}minho_gan.png`} alt="minho_gan" />
          </td>
          <td style={{textAlign: 'center'}}>
            <h3>내 아바타를 생성하고 ChatGPT와 대화 해보세요!</h3>
            <p style={{
                      backgroundColor: "rgb(200, 180, 230)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                      textDecoration: "none",
                      width: 400
                    }}>
              <Link href="../menu/service">서비스 페이지로 &raquo;</Link>
            </p>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
  );
}
export default Home