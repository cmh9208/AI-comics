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
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.logo} >
          <Link href='/'>
           <img style={{ width: 100 }} src={`${url}ai_logo.png`} alt="logo" />
          </Link>
            
          </div>
          <div className={styles.menus} >
            <div className={styles.mainMenu}>
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/intro'>소개</Link></Button>  
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/team'>팀원</Link></Button>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                style={{fontSize:"20px",color:"black"}}
              >
                서비스
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}><Link href='/menu/services/chatbot'>챗 GPT-3.5</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/gan'>이미지 변환</Link></MenuItem>

              </Menu>
            </div>
          </div>

      </div>
    </div>
  )
}

