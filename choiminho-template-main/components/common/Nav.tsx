import React from 'react'
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
  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.logo} >
          <Link href='/'>
            <Image src="/images/mibotlogo8.png" width={140} height={87} alt="LOGO"/></Link>
          </div>
          <div className={styles.menus} >
            <div className={styles.mainMenu}>
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/intro'>Introduction</Link></Button>  
              <Button style={{fontSize:"20px",color:"black"}}><Link href='/menu/team'>Team</Link></Button>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                style={{fontSize:"20px",color:"black"}}
              >
                Service
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
                <MenuItem onClick={handleClose}><Link href='/menu/services/gan'>GAN</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/voice'>Voice</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/chatbot'>ChatBot</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/mibot'>The mibot</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/imageprocess/fileupload'>Image Upload</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/voice/voiceupload'>Voice Upload</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href='/menu/services/voice/player'>voice play</Link></MenuItem>
              </Menu>
            </div>
          </div>
        <div className={styles.loginMenu}>
          <div >
            <Link href='/auth/login'>
              로그인</Link>
          </div>
          <div >
            <Link href='/auth/join' className={styles.register}>
            회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

