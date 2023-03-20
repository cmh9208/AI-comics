import axios, {AxiosError, AxiosResponse} from "axios";
import { User } from "../types";

const SERVER = process.env.NEXT_PUBLIC_SERVER
const headers = {
    "Content-Type" : "application/json",
    Authorization: "JWT fefege...",
}

export const userJoinApi = async (
    payload: {
        username: string,
        password: string,
        email: string,
        name: string,
        tel: string,
        birth: string,
        address: string
    }) => {
        try{
            console.log(typeof({payload}))
            const response : AxiosResponse<any, User> =
            await axios.post(`${SERVER}/users/join`, payload, { headers })
            console.log(response.data)
            if(response.data.message == "SUCCESS") { alert('회원가입 성공') }
            return response.data
        }catch(err){
            return err;
        }
    }

    export const userLoginApi = async (
        userLoginData: { username:string, password:string }) => {
            try{
                const response : AxiosResponse<any, User> =
                await axios.post(`${SERVER}/users/login`, userLoginData, { headers })
                const loginSuccessUser = response.data.token
                if(loginSuccessUser === null && AxiosError || loginSuccessUser.value === 'FAILURE'){
                    alert('아이디 및 비밀번호를 확인해주세요.')
                }else {
                    localStorage.setItem("loginSuccessUser", loginSuccessUser)
                    alert('로그인 성공')}
                return response.data
            }catch(err){
                return err;
            }
        }
    
    
    export const loadUserApi = async(
        token: User) => {
            try {
                console.log(`LOGIN CHECK ${token}`)
                console.log(JSON.stringify(token))
                const response: AxiosResponse = await axios.post(`${SERVER}/users/token`, token , {headers})
                console.log (`서버 응답1 + ${JSON.stringify(response.data)}`)
                return response.data
            } catch (err) {
                return err;
            }
        }
    

    

    