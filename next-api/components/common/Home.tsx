import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'

import Link from 'next/link';

const Home: React.FC = () => {
 const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")
  
  return (
    
    <div className={styles.container} >
      <div className={styles.mainText} style={{ display: 'flex' }}>
      
        <table>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}> <h4>원본 이미지</h4>
              <img style={{width: 300}}  src={`${url}face_iu.jpg` }/>
              </td>
              <td style={{ textAlign: "center" }}> <h4>만화 이미지</h4>
              <img style={{width: 300}}  src={`${url}fake_face_iu.jpg` }/>
              </td>
              <td style={{ textAlign: "center" }}> <h4>페이크 영상</h4>
              <video style={{width: 300}}  controls>
              <source src={`${url}fake_iu.jpg.mp4` } type="video/mp4" />
              </video>
              </td>
            </tr>
         
            <tr>
              <td> 
              <img style={{width: 300}}  src={`${url}test.jpg` }/>
              </td>
              <td> 
              <img style={{width: 300}}  src={`${url}fake_face_test.jpg` }/>
              </td>
              <td> 
              <video style={{width: 300}}  controls>
              <source src={`${url}fake_test.jpg.mp4` } type="video/mp4" />
              </video>
              </td>
            </tr>

            <tr>
              <td> 
              <img style={{width: 300}}  src={`${url}1.jpg` }/>
              </td>
              <td> 
              <img style={{width: 300}}  src={`${url}2.jpg` }/>
              </td>
              <td> 
              <video style={{width: 300}}  controls>
              <source src={`${url}3.mp4` } type="video/mp4" />
              </video>
              </td>
            </tr>

            <tr>
              <td> 
              <img style={{width: 300}}  src={`${url}nayeon.jpg` }/>
              </td>
              <td> 
              <img style={{width: 300}}  src={`${url}fake_face_nayeon.jpg` }/>
              </td>
              <td> 
              <video style={{width: 300}}  controls>
              <source src={`${url}fake_nayeon.jpg.mp4` } type="video/mp4" />
              </video>
              </td>
            </tr>
           
          </tbody>          
          </table>
    
      </div>

 
  <section className='wrapper'>
      <article className='product1'>
        <h2>step1.내 만화 캐릭터 생성 해보기</h2>
        <p><Link href="/menu/services/gan">생성 페이지로 이동&raquo;</Link></p>
      </article>
      <article className='product2'>
        <h2>step2.Chat GPT 이용 해보기</h2>
        <p><Link href="/menu/services/chatbot">챗봇 페이지로 이동 &raquo;</Link></p>
      </article>

  </section>
</div>
  )
}
export default Home