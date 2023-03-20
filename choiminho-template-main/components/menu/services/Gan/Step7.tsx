import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'


function Step7() {
    const imgset = '/j/6.gif'
        
    return (
        <>
        <h1>7. 모션화 </h1>
        <div>
            <img src={imgset} width={500} height={500}/>
        </div>
        
         <Button><Link href="/menu/services/imageprocess/fileupload">select again &raquo;</Link></Button><br/>
         <Button><Link href="/menu/services/chatbot">start chatbot! &raquo;</Link></Button>
        </>
    )
}

export default Step7