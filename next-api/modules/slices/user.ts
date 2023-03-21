import { createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import { LoginUser, User, UserInfo, UserInfoState, UserLoginInput, UserState  } from '../types/index'

/**
export interface UserInput{
    username : string, password: string, email: string, name: string, tel:string,
    birth:string, address: string
}
 */

const initialState: UserState = {
    data: [],
    status: 'idle',
    token: null,
    isLoggined: false,
    error : null,
    loginedUser: null,
    check: false
}

//export declare function createSlice<State, CaseReducers extends SliceCaseReducers<State>
//, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name>): 
//Slice<State, CaseReducers, Name>;

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers:{
        joinRequest(state: UserState, action : PayloadAction<User>){
            state.status = 'loading';
            console.log(`진행4 : 회원가입 데이터 ${JSON.stringify(state.data)}`)
            
        },
        joinSuccess(state, action : PayloadAction<User>){
            state.status = 'idle'  
            state.data = [...state.data, action.payload]
            
        },
        joinFailure(state: UserState, {payload}){
            state.status = 'failed'
            state.data = payload
        },
        loginRequest(state, action: PayloadAction<UserLoginInput>){
            state.status = 'loading';
        },

        loginSuccess(state, action: PayloadAction<LoginUser>){
            const newState = state.data.concat(action.payload)
            state.data = newState
            state.status = 'idle'
            state.isLoggined = true
        },
        loginFailure(state, {payload: error}){
            state.status = 'failed'
            state.error = error
        },
        loginUserRequest(state : UserState, action:PayloadAction){
            console.log(`진행: 토큰으로 유저 정보 요청 ${JSON.stringify(action.payload)}`)
        },
        loginUserSuccess(state: UserState, action: PayloadAction<User>){
            console.log(`진행 : 유저 정보 요청 성공 ${JSON.stringify(action.payload)}`)
            state.data = [...state.data, action.payload]
        },
        loadUserFailure(state, {payload : error}){
            console.log(`진행 : 유저 정보 요청 실패`)
        },
        
    }
})

export const { joinRequest, joinSuccess, joinFailure,
                loginRequest, loginSuccess,loginFailure,
            loginUserRequest, loginUserSuccess, loadUserFailure } = userSlice.actions;

const {reducer, actions} = userSlice
export const userActions = actions
export default reducer