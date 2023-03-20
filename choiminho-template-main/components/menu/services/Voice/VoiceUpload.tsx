import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import { VoiceController,FileService, FileValidator as validator } from '../../../../modules'
import Link from 'next/link'


function VoiceUpload() {
    const [ img, setImg ] = useState('')
    
    //const [isFileTypesModalOpen, setIsFilesTypeModalOpen] = useState<boolean>(false)
    const [uploadFormError, setUploadFormError] = useState<string>('')

    const handleFileUpload = async (element: HTMLInputElement) => {
        const file = element.files
        if (!file) {
            return
        }
        const validFileSize = await validator.validateFileSize(file[0].size)
        const validFileType = await validator.validateFileType(FileService.getFileExtension(file[0].name))
        if (!validFileSize.isValid) {
            setUploadFormError(validFileSize.errorMessage)
            return
        }
        if (!validFileType.isValid) {
            setUploadFormError(validFileType.errorMessage)
            return
        }
        if (uploadFormError && validFileSize.isValid) {
            setUploadFormError('')
        }
        const voiceController = new VoiceController(file[0])
        const fileUploadResponse = await voiceController.uploadVoice()
        console.log(' ############## ')
        console.log(' fileUploadResponse : '+fileUploadResponse)
        console.log(' ############## ')

        element.value = ''
    /** 샤크라 의존 컴포넌트
        const toast = createStandaloneToast()
        toast({
            title: fileUploadResponse.success ? 'File Uploaded' : 'Upload Failed',
            description: fileUploadResponse.message,
            status: fileUploadResponse.success ? 'success' : 'error',
            duration: 3000,
            isClosable: true
        })  */
    }
    return (
        <Box
            width="50%"
            m="100px auto"
            padding="2"
            shadow="base"
        >
            <Flex
                direction="column"
                alignItems="center"
                mb="5"
            >
                <Text fontSize="2xl" mb="4">Voice Upload</Text>
                
                {
                    uploadFormError &&
                    <Text mt="5" color="red">{uploadFormError}</Text>
                }
                <Box
                    mt="10"
                    ml="24"
                >
                    <Input
                        type="file"
                        variant="unstyled"
                        onChange={(e: SyntheticEvent) => handleFileUpload(e.currentTarget as HTMLInputElement)}
                    />
                </Box>
            </Flex>
            <Button><Link href="/">화면 출력 &raquo;</Link></Button>
        </Box>
        
        
    )
}

export default VoiceUpload