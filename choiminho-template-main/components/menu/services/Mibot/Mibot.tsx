import React from 'react'
import Button from '@mui/material/Button';


type Props = {
  userName: string
  name : string
}

const Mibot = (props: Props) => {
  return (
    <div>
        <h3>mibot 사용해보기</h3>
        <table>
            <tbody>
                <tr>
                    <td>
                    <img style={{width: 500}} src = "http://storage.enuri.info/pic_upload/knowbox2/202106/01104537220210630397b14e9-8cd4-40b8-aa08-9350070f8c16.JPEG" alt='logo'/>
                    </td>
                </tr>                
            </tbody>
        </table>
    </div>
    
  )
}

export default Mibot