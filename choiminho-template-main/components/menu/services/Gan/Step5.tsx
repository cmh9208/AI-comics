import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'

function Step5() {
    const imgset = '/j/4.png'
        
    return (
        <>
        <h1>5. 최종 결과 이미지 선택</h1>
        <div>
            <img src={imgset} width={500} height={500}/>
        </div>
        
        <input/><br/>
        <input/>
        <Button><Link href="/menu/services/imageprocess/step6">select &raquo;</Link></Button><br/>
        </>
    )
}

export default Step5