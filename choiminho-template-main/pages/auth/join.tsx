import React, {useState, useEffect} from 'react'
import Register from '@/components/auth/Join'
import { NextPage } from 'next'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { joinRequest } from '@/modules/slices/user'
import { UserState, User, } from '@/modules/types'
import { AppState } from '@/modules/store'


const RegisterPage=()=> {
  const [loginUser, setLoginUser] = useState<User>({username:'', password:'', email:'', name:'', address:'', birth:'', tel:''})
  const dispatch = useAppDispatch()

  const {isLoggined, loginedUser} = useAppSelector((state: AppState) => state.login || {})
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
    dispatch(joinRequest(loginUser))
    console.log(' 모듈에 저장된 로그인값: '+JSON.stringify(loginedUser))
  }
  
  return (
    <div>
      <Register handleChange={onChange } handleSubmit={onSubmit}/>
    </div>
)  
}


export default RegisterPage
