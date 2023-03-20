import { UploadFileResponse }  from '../types'
import FileService  from '../services/FileService'

class FileController {
    private file: File
    constructor(file: File) {
        this.file = file
    }
    async uploadFile(): Promise<UploadFileResponse> {
        const fileService = new FileService()
        const uploadResponse = await fetch('http://127.0.0.1:8080/images/upload', {
            method: 'POST',
            body: fileService.getFormData(this.file)
        })

        const responseJson = await uploadResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }
        
        return {
            success: true,
            message: 'Uploaded Successfully'
        }
    }
    
    /** 
    async getFile(): Promise<UploadFileResponse> {
        const fileService = new FileService()
        const getResponse = await fetch(`http://127.0.0.1:8080/getOne/{imageid}`, {
            method: 'GET',
            body: fileService.getFormData(this.file)
        })

        const responseJson = await getResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }
        
        return {
            success: true,
            message: 'Get Successfully'
        }
    }
    */
}

export default FileController