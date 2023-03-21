import { createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import { string } from 'prop-types';
import { AppState } from '../store'

export interface VoiceInput{
    username:string, voice:string
}

export interface Voice {
    username:string, voice:string
}

export interface VoiceState{
    data: Voice[]
    status: 'idle' | 'loading' | 'failed'
    error : null
}

const initialState: VoiceState = {
    data: [],
    status: 'idle',
    error : null
}

export const voiceSlice = createSlice({
    name: 'voiceSlice',
    initialState,
    reducers:{
        voiceRequest(state, action: PayloadAction<VoiceInput>){
            state.status = 'loading';
            console.log(`업로드 음성 ${JSON.stringify(state.data)}`)
        },
        voiceSuccess(state, action: PayloadAction<Voice>){
            const newState = state.data.concat(action.payload)
            state.status = 'idle'
            state.data = [...state.data, action.payload]
            alert(`진행 : 음성 데이터 ${state.data}`)
        },
        voiceFailure(state: VoiceState, {payload}){
            state.status = 'failed'
            state.data = payload
        }
        
    }
})

export const { voiceRequest, voiceSuccess, voiceFailure } = voiceSlice.actions;

const {reducer, actions} = voiceSlice
export const voiceActions = actions
export default reducer