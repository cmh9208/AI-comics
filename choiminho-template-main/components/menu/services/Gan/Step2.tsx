import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'


function Step2() {
    
    const imgset = '/j/2.png'
        
    return (
        <>
        <h1>2. 얼굴 인식 결과</h1>
        <div>
            <img src={imgset} width={500} height={500}/>
        </div>
        
        <Button><Link href="/menu/services/imageprocess/step3">check &raquo;</Link></Button>
        
        </>
    )
}

export default Step2