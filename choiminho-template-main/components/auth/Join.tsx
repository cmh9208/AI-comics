import React from 'react'
import styles from '@/styles/Register.module.css'
import Link from 'next/link'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

type Props = {
  handleChange : (e : React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleSubmit : (e : React.FormEvent<HTMLFormElement>) => void
}
const Register : React.FC<Props> = ({handleChange, handleSubmit}: Props) =>{

    return (
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
            <h1 >회원 가입</h1>
            <div>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="아이디"
              type="username"
              id="username"
              onChange={handleChange}
            />     
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="이름"
              name="name"
              autoComplete="name"
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id=""
              label="이메일"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />  
            <TextField
              margin="normal"
              required
              fullWidth
              name="birth"
              label="생년월일"
              id="birth"
              autoComplete="birth"
              onChange={handleChange}
            />          
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="주소"              
              id="address"
              autoComplete="address"
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="tel"
              label="전화번호"              
              id="tel"
              autoComplete="tel"
              onChange={handleChange}
            />
            </div>
            <div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
            회원가입
            </Button>
            </div>
            <div>
            <Link href='/auth/login' >
                <h5 style={{ marginTop: "0.5rem",textAlign:"end",color:"#5e5ee6",cursor:"pointer" }}>
						로그인
            </h5>
            </Link>            
            </div>
            <div>
                <h5>계속 진행하면 mibot의 서비스 약관 및 개인정보 보호정책에 동의한 것으로 간주됩니다.</h5>
            </div>
            </form>
        
    </div>
  )
}

export default Register