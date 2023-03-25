import React, { useState } from 'react'
import Link from 'next/link';


const Home: React.FC = () => {
 const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 2000}} >
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
          <td>
            <img style={{ width: 300 }} src={`${url}na1.jpg`} alt="logo" />
          </td>
          <td>
           <img style={{ width: 300 }} src={`${url}na2.jpg`} alt="logo" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_nayeon.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr>
          <td>
            <img style={{ width: 300 }} src={`${url}ss1.jpg`} alt="logo" />
          </td>
          <td>
           <img style={{ width: 300 }} src={`${url}ss2.jpg`} alt="logo" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_ss.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>

        <tr>
          <td>
            <img style={{ width: 300 }} src={`${url}ha1.jpg`} alt="fake_nayeon" />
          </td>
          <td>
            <img style={{ width: 300 }} src={`${url}ha2.jpg`} alt="fake_nayeon" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_nayeon.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>
        
        <tr>
          <td>
            <img style={{ width: 300 }} src={`${url}minho_gan.png`} alt="minho_gan" />
          </td>
          <td>
            <h4>내 아바타 생성 해보기</h4>
            <p style={{ fontSize: '15px' }}>
              <Link href="/menu/services/gan">아바타 생성 페이지로 이동&raquo;</Link>
            </p>
            <h4>아바타랑 대화하기</h4>
            <p style={{ fontSize: '15px' }}>
            <Link href="/menu/services/chatbot">GPT-3 챗봇 페이지로 이동 &raquo;</Link>
            </p>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
  );
}
export default Home