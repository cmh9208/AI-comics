import { SyntheticEvent, useState } from 'react'
import { Box, Text, Flex,  Input, Button } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'

function Step3() {
    const imgset = '/j/grid.png'
        
    return (
        <>
        <h1>3. 스타일 이미지 선택</h1>
        <div>
            <img src={imgset} width={500} height={500}/>
        </div>
        
        <input/>
        <Button><Link href="/menu/services/imageprocess/step4">select &raquo;</Link></Button>

        </>
    )
}

export default Step3