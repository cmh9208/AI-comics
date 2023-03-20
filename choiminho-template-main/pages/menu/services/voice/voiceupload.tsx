import { ChakraProvider } from '@chakra-ui/react' 

import VoiceUpload from '@/components/menu/services/Voice/VoiceUpload'
//import FileGet from '@/components/menu/services/Gan/FileGet'

function Main() {
    return (
        <ChakraProvider>
            <VoiceUpload />
            
        </ChakraProvider>
    )
}

export default Main