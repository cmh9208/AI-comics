import Image from 'next/image';
import React, { useState } from 'react'
import minho from "@/public/minho.png"
// import Example from '@/components/menu/services/Example';

const Introduce: React.FC = () => {
  const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <table>
        <tbody>
          <tr>
            <td style={{width: 250, height: 700}}>
              <img style={{ width: 200 }} src={`${url}minho.png`} alt="minho" />
              <p>dddddddddddddddddddddddd</p>
              <p>dddddddddddddddddddddd</p>
              <p>dddddddddddddddddddddddddd</p>
              <p>dddddddddddddddddddd</p>
              <p>ddddddddddddddddddddd</p>
            </td>
            <td>
              {/* <Example/> */}
            </td>
          </tr>
        </tbody>
      </table>
      <img style={{ width: 700 }} src={`${url}web.gif`} alt="minho" />
      
    </div>
    
  );
};

export default Introduce;