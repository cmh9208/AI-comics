import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'

import Link from 'next/link';


const Home: React.FC = () => {
 const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")
  return (
    <div className={styles.container}>
    <table className={styles.mainText}>
      <tbody>
        <tr>
          <td>
            <h4>원본 이미지</h4>
            {/* <Image src={iu1} alt="IU" width={300} height={300} /> */}
          </td>
          <td>
            <h4>만화 이미지</h4>
            {/* <Image src={iu2} alt="IU2" width={300} height={300} /> */}
          </td>
          <td>
            <h4>페이크 영상</h4>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_iu.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>
        <tr>
          <td>
            {/* <Image src={na1} alt="NA" width={300} height={300} /> */}
          </td>
          <td>
            {/* <Image src={na2} alt="NA2" width={300} height={300} /> */}
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_nayeon.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>
        <tr>
          <td>
            {/* <Image src={s} alt="S" width={300} height={300} /> */}
          </td>
          <td>
            {/* <Image src={ss} alt="SS" width={300} height={300} /> */}
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_ss.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>
        <tr>
          <td>
            <img style={{ width: 300 }} src={`${url}nayeon.jpg`} alt="nayeon" />
          </td>
          <td>
            <img style={{ width: 300 }} src={`${url}fake_face_nayeon.jpg`} alt="fake_nayeon" />
          </td>
          <td>
            <video style={{ width: 300 }} controls>
              <source src={`${url}fake_nayeon.jpg.mp4`} type="video/mp4" />
            </video>
          </td>
        </tr>
      </tbody>
    </table>

    <table className={styles.mainText}>
      <tbody>
        <tr>
          <td>
          <img style={{ width: 300 }} src={`${url}minho_gan.png`} alt="minho_gan" />
          </td>
        </tr>
      </tbody>
    </table>

    <section className="wrapper">
      <article className="product1">
        <h4>내 아바타 생성 해보기</h4>
        <p style={{ fontSize: '15px' }}>
          <Link href="/menu/services/gan">아바타 생성 페이지로 이동&raquo;</Link>
        </p>
      </article>
      <article className="product2">
        <h4>아바타랑 대화하기</h4>
        <p style={{ fontSize: '15px' }}>
          <Link href="/menu/services/chatbot">GPT-3 챗봇 페이지로 이동 &raquo;</Link>
        </p>
      </article>
    </section>
  </div>
  );
}
export default Home