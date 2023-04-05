import React, { useState } from 'react'
import Link from 'next/link';
import styles from '@/styles/Nav.module.css'
import Image from 'next/image';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [url, setUrl] = useState<string>("https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/")

  return (
    <div style={{height:170}} className={styles.container}>
      <div className={styles.header } style={{justifyContent: 'center'}}>
          <div className={styles.logo} style={{width:300}}>
            <Link href='/'>
             <img style={{ width: 80 }} src={`${url}ai_logo.png`} alt="logo" />
            </Link>
          </div>
          <div className={styles.menus} >
            <div className={styles.mainMenu}>
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/intro'>소개</Link></Button>  
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/team'>팀원</Link></Button>
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/service'>서비스</Link></Button>
            </div>
          </div>

      </div>
    </div>
  )
}

