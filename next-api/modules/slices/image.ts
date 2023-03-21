import { createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {  ImageState, InputImage  } from '../types'
import { AppState } from '../store'


const initialState: ImageState = {
    data: { name:'', lastModified: 0, lastModifiedDate: 0, type: '', webkitRelativePath: '', size: 0},
    status: "loading"
}

const imageSlice = createSlice({
    name: 'imageSlice',
    initialState,
    reducers:{
        imageUpload : (state: ImageState, action: PayloadAction<InputImage>) => {
            state.data = action.payload
            console.log('>>' + JSON.stringify(action.payload.name))
            console.log('>>' + JSON.stringify(action.payload.lastModified))
            console.log('>>' + JSON.stringify(action.payload.lastModifiedDate))
            console.log('>>' + (action.payload))
            state.status = 'loading'
            const Imagename = action.payload




            const Image = {Imagename}
        },
        uploadSuccess: (state, action: PayloadAction<InputImage>) => {
            state.data = action.payload
            state.status = 'successed'
        },
        uploadFailure : (state: ImageState, action) => {
            state.data = action.payload
            state.status = 'failed'
        }
        
    }
})

export const { imageUpload, uploadSuccess, uploadFailure } = imageSlice.actions;

const {reducer, actions} = imageSlice
export const imageActions = actions
export default reducer