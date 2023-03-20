import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'
import { step1Api } from './api'

function Step1() {

    //const [ img, setImg ] = useState('')
    const imgset = '/j/1.png'
    const res = step1Api("./image_save/1.png")
    
    
    return (
        <>
        <div>
        <h1>1. 업로드 이미지 확인</h1>
        </div>
        <div>
            <img src={imgset} width={400} height={500}/>
        </div>
        
        <Button><Link href="/menu/services/imageprocess/step2">Face detection &raquo;</Link></Button>

        </>
    )
}

export default Step1