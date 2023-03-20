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
              <td> <h3>원본 이미지 </h3>
              <img style={{width: 300}}  src={`${url}face_iu.jpg` }/>
              </td>
            </tr>
          </tbody>          
          </table>
     

          <table>
          <tbody>
            <tr>
              <td> <h3>만화 이미지 </h3>
              <img style={{width: 300}}  src={`${url}fake_face_iu.jpg` }/>
              </td>
            </tr>
          </tbody>          
          </table>
      

          <table>
          <tbody>
            <tr>
              <td> <h3>페이크 영상 </h3>
              <video style={{width: 300}}  controls>
              <source src={`${url}fake_iu.jpg.mp4` } type="video/mp4" />
              </video>
              </td>
            </tr>
          </tbody>          
          </table>
    
      </div>

 
  {/* <section className='wrapper'>
      <article className='product1'>
        <h2>step1.내 아바타 생성해보기</h2>
        <p><Link href="/menu/services/imageprocess/fileupload">내 아바타 만들어보기 &raquo;</Link></p>
      </article>
      <article className='product2'>
        <h2>step2.챗봇 이용해보기</h2>
        <p><Link href="/menu/services/chatbot2">챗봇 이용해보기 &raquo;</Link></p>
      </article>
      <article className='product3'>
        <h2>step3.나의 음성 입력해보기</h2>
        <p><Link href="/menu/services/voice">음성인식 이용해보기 &raquo;</Link></p>
        
      </article>
      <article className='product3'>
        <h2>step4.미봇 이용해보기</h2>
        <p><Link href="/menu/services/chatbot">go to mibot! &raquo;</Link></p>
      </article>
  </section> */}
</div>
  )
}
export default Home