import Image from 'next/image';
import React, { useState } from 'react'

const Introduce: React.FC = () => {
  const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/");

  const OnClick1 = () => {
    window.location.href = 'https://github.com/cmh9208/AI-comics';
  };


  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 800}}>
      <table>
        <tbody>

          <tr>
            <td style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px' }}>Click.</p>
              <img onClick={OnClick1} style={{ width: 30 }} src={`${url}github.png`} alt="My button image" />
              {/* &nbsp;&nbsp;&nbsp; */}
            </td>
          </tr>

          <tr style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500}}>
            <td style={{ textAlign: 'center', width: 230, boxShadow: '0 0 5px 5px rgba(0, 50, 200, 0.3)'}}>
              <img style={{ width: 200 }} src={`${url}minho.png`} alt="minho" />
              <p>name: Choi Minho Ho</p>
              <p>Email: cwh625@gmail.com</p>
              <p>Kakao: choiminho1</p>
            </td>
          </tr>

          <tr>
            <td style={{ textAlign: 'center' }}>
             <p>tools available</p>

              <img style={{ width: 700 }} src={`${url}web.gif`} alt="minho" />
            </td>
          </tr>
          
        </tbody>
      </table>
      
    </div>
    
  );
};

export default Introduce;