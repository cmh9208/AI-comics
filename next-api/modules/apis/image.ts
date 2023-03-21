import { InputImage } from "../types";
import axios, {AxiosResponse} from "axios";

const SERVER = process.env.NEXT_PUBLIC_SERVER
const headers = {
    "Content-Type" : "multipart/form-data",
    Authorization: "JWT fefege...",
}

export const addImage = async (
    payload : {
        name: string
        lastModified: number
        lastModifiedDate: number
        type: string
        webkitRelativePath: string    
        size : number
    }) => {
    try {
        console.log('API' + payload)
        const response: AxiosResponse<any, InputImage> =
        await axios.post(`${SERVER}/images/upload`, payload, {headers} )
        console.log(response.data)
        if(response.data.message == "SUCCESS") { alert('이미지 전송 성공') }
        return response.data
    } catch (err) {
        return err;
    }
}