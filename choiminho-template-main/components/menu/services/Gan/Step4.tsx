import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'

function Step4() {
   
    const imgset = '/j/3.jpg'
    const imgset2 = '/j/2.png'
       
    return (
        <>
        <h1>4. 합성할 이미지 확인</h1>
        <div>
            <img src={imgset2} width={300} height={300}/>
            <img src={imgset} width={300} height={300}/>

        </div>
        <Button><Link href="/menu/services/imageprocess/step5">check &raquo;</Link></Button>

        </>
    )
}

export default Step4