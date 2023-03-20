import React from 'react'
import Button from '@mui/material/Button';

type Props = {
  userName: string
  name : string
}

const Voice = (props: Props) => {
  return (
    <div style={{display: 'flex', flexDirection:'row' }}>
      <div ></div>
       
        <div style={{display: 'flex', flexDirection:'row' }}/>
        <table>
            <tbody>
                <tr>
                    <td>  <h3>음성 녹음</h3>
                        <img style={{width: 300}} src = "https://kr.seaicons.com/wp-content/uploads/2015/10/sound-recorder-icon.png" alt='logo'/>
                    </td>
                </tr>
                <label><input type = "submit" value="녹음"/></label>
            </tbody>
        </table>

        <h3>텍스트 변환</h3>
        <table>
            <tbody>
                <tr>
                    <td> 
                        <img style={{width: 200}} src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAAw1BMVEX////+//329vbw8PDY2NiZmZn8/Pz5+fmtra3f39+KiorCwsJiYmJzc3Pp6elmZmbOzs5ZWVm3t7fIyMh9fX2mpqaRkZFubm6Dg4OgoKBLS0tSUlL6+e3L0861xL96kYUuYUh4lofz7NX38uG5xLpNfGCInJPw5Lno0Irk05mmtqZZfmLt3afqzHru7+LAzcfb5N5IcFeIpZaIo4ilsqxQeWRxjXNgf29BcF3Lzrr37c1kiWqFpYNdh3FujXqsv7M/Pz+IRTuBAAAEeElEQVR4nO3YC1fbNhgGYFkX32TLtnxPQlcgg0DpbELXbrQj/f+/apJzZYUd6BpSdt7nnIQkTsIr5dMnJ4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPzv0KNDJ3gexyEOefOLd+gcz+AMF/r2mB06ydM5k5NTE3r665lz6ChP55zPLkzcy3evqaadq/ez3zrSXR46yHPY8ujf9tND53gWW8n99bw7dI5nsaHZzbve6T+8ePuQ3/tCx7bp7vfjj9ef6I8M9Dg38Ctf2VtB9e3R4MnvQ+dfPv/x58XVi3Q9HpZa1NrerO9/uNLsb/Ew/S5/aAZVsNkAlSL8eD4/OpnNJvsMu8Zs0iCyU9qkm0ddc0lyM6Qxt3crfe8l0h7mRaTd1SPdHbnsmEcmt7d7m2lnuXi2dBauonmpKRWeFHFJQ/tYkdjh6ORe6NqMTsWVTtbVM/3cnZFVce8ztLOTW47bxEy4KE1ptjYIy9ukEnWVEq+oPELlyD7NHYrEXPkhJWlBVcZXb3D05dMez5VcZ5N5i4atOzZZ2yIPmFgF8WgYl5EOgpTrOBvZImK+uaZVQKQZYl74PFqH7v+a7rHZ0WEHcE6uTnYeZHXOMlMVoq6TKk5JUJalr2UcB+UoDpt6VIdj21+YyUto4xOZMaLaqCnUcia6u5u7u7O9xXbPjswcT67e77YmU6NpYj7eqqUyjDRRTZ2NRlkRUzeoo7qQTI/skmONndkqNKFNWlnEq+XJFouPN9dn+yuQ7lIRb3J+sZlp137ibWF7dGxq2mQZKtelMhGE5Flim56f+IFsTb0Ls0SLITQTqdp28X6+zzM8t+udBZmcru8zO3lpnNkPfmRnjkf58ojMNPFq37ez6tfR169hKpT2tVmuecPMa2gq6HLUe+cF/Xxnq5B2Ij1uOzQf2QG4bdb6LSOuMIsviGRgOrUn6kBKJkLzhCD0iQ6pW8Ze0ZrnU98n++x0K92i395ptxuKEstR6XocmYVW1XbpJUWiiCoacyBvqpibPSU15URpIciwjyohbOi9pnYZ66c7Mx2mDzzJI8xTYqhY39Y0H65CTcMx8RuqTB2xWqthXSrb3feMzs8WHyjZzLXwH6rJIBHrgdm/eW3icd8jStp6KhNOWCbz0A5LFt99dvh0arqYdnSzF6QP/U8mdObvFn6sNrc9lzSm5NlY+pWyNdOob9/gh3Op13eLdYeiVVZt/itrl52Xt54stv2MtuHuWV5QaHMaG/mlYEqHIScvhC769VbARDLKmlJynhej8TJ0oJlKtmFYXO5uHHkTkCCLiiqss1A8/Yz7PzErXXWXbxhZtSpeijDKmiKuK7kqcB0X9Ta0XrfuFXuEt0KISsiX+37FPlyup3poVVTxlHO+Palnbay3FVGGD5UtU0q90Lergcu63uadnD72PYOynabivWS2f2Uq43Q2Oyev6Jeswe3s4vbQGZ7JbL2nj5bHT8v55zeYV+HVBV79Ev76ZhoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOCn8DdbCT5BbS307wAAAABJRU5ErkJggg==" alt='logo'/>
                    </td>
                </tr>
              
            </tbody>
        </table>

        
        <table>
            <tbody>
                <tr>
                    <td> <h3>음성 출력</h3>
                        <img style={{width: 300}} src = "https://cdn-icons-png.flaticon.com/512/4827/4827894.png" alt='logo'/>
                    </td>
                </tr>
                <label><input type = "submit" value="출력하기"/></label>
            </tbody>
        </table>
    </div>
    
  )
}

export default Voice