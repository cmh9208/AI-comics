import { ChakraProvider } from '@chakra-ui/react' 

import FileUpload from '@/components/menu/services/Gan/FileUpload'
//import FileGet from '@/components/menu/services/Gan/FileGet'

function Main() {
    return (
        <ChakraProvider>
            <FileUpload />
            
        </ChakraProvider>
    )
}

export default Main