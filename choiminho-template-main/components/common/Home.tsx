import React from 'react'
import styles from '@/styles/Home.module.css'

import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainText}>
        <table>
          <tbody>
            <tr>
              <td> <h1>Hello mibot! </h1>
              <img style={{width: 300}} src = "https://cdn-icons-png.flaticon.com/512/6173/6173141.png" alt='logo'/>
              </td>
            </tr>
          </tbody>          
          </table>
      </div>
  <section className='wrapper'>
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
      
  </section>
</div>
  )
}
export default Home