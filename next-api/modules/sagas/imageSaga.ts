import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects'
import {  imageActions, uploadSuccess } from '@/modules/slices/image';
import {AxiosResponse } from 'axios'
import { addImage } from '../apis/image'


interface InputImage{
    type: string
    payload:{
        name: string
        lastModified: number
        lastModifiedDate: number
        type: string
        webkitRelativePath: string    
        size : number
    }
}

// saga까지 진행 안됨 
function* addImagesSaga(image: InputImage){
    try{
        console.log(' 3.  saga내부 upload 성공  '+ image)
        console.log(image.payload)
        const response: any = addImage(image.payload)
        yield put(uploadSuccess(response.data))
        //window.location.href = ('/')
    }catch(error){
        return (error)
    }
}

/**
function* addImageSaga ( action : {payload : InputImage}) {
    const {uploadSuccess, uploadFailure} = imageActions
    const param = action.payload
    try{
        const response: InputImage = yield call(addImage, param)
        yield put(uploadSuccess(response))
    } catch(error) {
        yield put(uploadFailure(error))
    }
}
*/
export function* watchAddImage(){
    yield takeEvery(imageActions.imageUpload, addImagesSaga)
}