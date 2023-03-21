import { UploadFileResponse }  from '../types'
import FileService  from '../services/FileService'

class VoiceController {
    private file: File
    constructor(file: File) {
        this.file = file
    }    
    async uploadVoice(): Promise<UploadFileResponse> {
        const fileService = new FileService()
        const uploadResponse = await fetch('http://127.0.0.1:8080/voices/upload', {
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
  
}

export default VoiceController