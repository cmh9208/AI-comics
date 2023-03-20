import React from 'react'
import styles from '@/styles/GoogleLogin.module.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from 'next/link';

export default function GoogleLogin() {
    return (
        <div className={styles.container}>
            <h1
                style={{
                    textAlign: "center",
                    marginTop: "4rem"
                }}>
                Google 로그인</h1>
            <div>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id=""
                    label="Google이메일"
                    name="userid"
                    autoComplete="userid"/>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"/>
            </div>
            <div >
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        mb: 1
                    }}>
                    GOOGLE 로그인
                </Button>
				<Link href="https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp" >
                    <a className={styles.text} target="_blank"><h5>GOOGLE가입</h5></a>
				</Link>
            </div>


            <div>
                <h5>계속 진행하면 mitbot의 서비스 약관 및 개인정보 보호정책에 동의한 것으로 간주됩니다.</h5>
            </div>

        </div>
    )
}