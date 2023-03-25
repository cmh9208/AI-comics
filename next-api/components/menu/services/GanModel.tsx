import React, { useState } from 'react';
import Image from "next/image";

const GanModel = () => {
  const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/");

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 800}}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center' }}>
              <h1>준비 중입니다.</h1>
              <div>
                <img style={{ width: 200 }} src={`${url}ai_logo.gif`} alt="logo_gif" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GanModel;
