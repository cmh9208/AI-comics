import React, {useState, useEffect} from 'react'
import Login from '@/components/auth/Login'
import { NextPage } from 'next'
import {useAppDispatch, useAppSelector} from '@/hooks'
import { loginRequest } from '@/modules/slices/user'
import { UserLoginInput } from '@/modules/types'
import { AppState } from '@/modules/store'

const LoginPage: NextPage = () => {
  const [loginUser, setLoginUser] = useState<UserLoginInput>({username : '', password: ''})
  const dispatch = useAppDispatch()

  const {isLoggined, loginedUser} = useAppSelector((state) => state.login || {})
  
  const onChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
    e.preventDefault()
    const { name ,value } = e.currentTarget
    setLoginUser({
      ...loginUser, [name]: value
    })
  }
  //const {isLoggined, loginedUser} = useSelector((state: RootStates) => state.login || {})
  
  const onSubmit = (e:any) => {
    e.preventDefault()
    console.log(`로그인 정보 ${JSON.stringify(loginUser)}`)
    dispatch(loginRequest(loginUser))
    console.log(' 모듈에 저장된 로그인값: '+JSON.stringify(loginedUser))
  }

  const handleCredentialResponse = async(response: any) => {
    const {credential} = response
    console.log("ENCODED JWT ID TOKEN" + response.credential)
  }
  
  return (
    <div>
      <Login handleChange={onChange} handleSubmit={onSubmit} />
    </div>
)}
export default LoginPage