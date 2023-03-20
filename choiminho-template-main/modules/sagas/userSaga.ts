import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects'
import { joinSuccess, userActions } from '@/modules/slices/user';
import { userJoinApi, userLoginApi,} from '../apis/user'
import { User } from '../types'
import {AxiosResponse } from 'axios'


interface UserJoinType{
    type: string
    payload:{
        username:string, password:string, email:string, 
        name:string, tel:string, birth:string, address:string
    }
}

export interface LoginUser{
    username : string, password: string, email: string, name: string, tel:string,
    birth:string, userId?: number, address: string, token: any, roles: any
}

export interface UserLoginInput{
    username: string,
    password: string
}


function* join(user: UserJoinType){
    try{
        console.log(' 3.  saga내부 join 성공  '+ JSON.stringify(user))
        const response: any = userJoinApi(user.payload)
        yield put(joinSuccess(response.payload))
        //window.location.href = ('/auth/login')
    }catch(error){
        yield put(userActions.joinFailure(error))
    }
}
function* login(action : {payload: UserLoginInput}){
    const {loginSuccess, loginFailure} = userActions
    const param = action.payload
    try{
        alert(' 진행 3: saga내부 성공  '+ JSON.stringify(param))
        const response: LoginUser = yield call(userLoginApi, param)
        yield put(loginSuccess(response))
        window.location.href = ('/')
    }catch(error){
         alert('진행 3: saga내부 join 실패  ') 
         yield put(loginFailure(error))
    }
}
export function* watchJoin(){
    const { joinRequest } = userActions
    yield takeEvery(joinRequest, join)
}
export function* watchLogin(){
    const {loginRequest} = userActions
    yield takeLeading(loginRequest, login)
}