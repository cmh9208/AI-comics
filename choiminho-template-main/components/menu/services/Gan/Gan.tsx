import React, { useState } from 'react'
import style from '@/styles/Table.module.css'
import { Props } from '@/pages/menu/services/gan'



const Gan: React.FC<Props> = ({onChange, onSubmit}: Props) => {
  return (
    <form onSubmit={onSubmit}>
    <div >
        
        <div style = {{display: 'flex', flexDirection:'row'}}>        
        <h1 className={style.h1}></h1>
        <table>
            <tbody>
                <tr>
                    <td> <h3 >윈터님의 이미지 추가 </h3>
                        <img style={{width: 300}} src = "/userimage/winter.jpg" />
                    </td>
                </tr>
                <input onChange={onChange} type = "file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload"/>
                <button className="btn btn-outline-secondary" type="submit" id="inputGroupFileAddon04">
                <h5>업로드</h5>
                </button>           
            </tbody>
        </table>
        <div style = {{display: 'flex', flexDirection:'row'}}>        
        <table>
            <tbody>
                <tr>
                    <td>
                        <img style={{width: 100}} src = "https://cdn-icons-png.flaticon.com/512/271/271226.png" alt='logo'/>
                    </td>
                </tr>                
            </tbody>
        </table>
        </div> 
        <div >
        <table>
            <tbody>
                <tr>
                    <td> <h3>캐릭터 스타일 선택</h3>
                        <img style={{width: 500}} src = "/userimage/grid.png" />
                    </td>
                </tr>
                <label><input type = "text" value="26"/><input type = "submit" value="select"/>
                </label>
            </tbody>
        </table>
        </div>
        <div style = {{display: 'flex', flexDirection:'row'}}>        
        <table>
            <tbody>
                <tr>
                    <td>
                        <img style={{width: 100}} src = "https://cdn-icons-png.flaticon.com/512/271/271226.png" alt='logo'/>
                    </td>
                </tr>                
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <td> <h3>원하는 이미지 선택</h3>
                        <img style={{width: 400}} src = "/userimage/select.png" alt='logo'/>
                    </td>
                </tr>
                <label><input type = "text" value="1/1"/><input type = "submit" value="select"/></label>
            </tbody>
        </table>
        </div>

        <div style = {{display: 'flex', flexDirection:'row'}}>        
        <table>
            <tbody>
                <tr>
                    <td>
                        <img style={{width: 100}} src = "https://cdn-icons-png.flaticon.com/512/271/271226.png" alt='logo'/>
                    </td>
                </tr>                
            </tbody>
        </table>
        </div> 
        <div >
        <table>
            <tbody>
                <tr>
                    <td> <h3>완성 이미지</h3>
                        <img style={{width: 400}} src = "/userimage/change.png" alt='logo'/>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
    </div>
    </form>
  )
}

export default Gan