import React from 'react'
import { Avatar, Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import umerCar from '../assets/g20.png';
import { useRouter } from 'next/router'

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

const Home: NextPage = () => {
  const router = useRouter();
  const handleUmerSelect = () => {
    localStorage.setItem("user", "umer");
    router.push("/dashboard", undefined, { shallow: true });
  };
  const handleAbeerSelect = () => {
    localStorage.setItem("user", "abeer");
    router.push("/dashboard", undefined, { shallow: true });
  };
  React.useEffect(() => {
    if (localStorage && (localStorage.getItem("user") !== "")) {
      router.push("/dashboard", undefined, { shallow: true });
    }
  }, [])
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
        <br />
        <Typography style={{ fontFamily: 'futura, sans serif', fontSize: '36px' }}>
          Select User
        </Typography>
        <br />
      </Box>
      <Button style={{ color: 'inherit', width: '390px' }} onClick={handleUmerSelect}>
        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
          <br />
          <br />
          <Avatar sx={{ bgcolor: 'darkred', margin: '0 auto', width: '80px', height: '80px', fontSize: '24px' }}>U</Avatar>
          <br />
          <Typography style={{ fontSize: '24px', fontFamily: 'futura, sans serif' }}>
            Umer
          </Typography>
          <br />
          <br />
        </Box>
      </Button>
      <Button style={{ color: 'inherit', width: '390px' }} onClick={handleAbeerSelect}>
        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
          <br />
          <br />
          <Avatar sx={{ bgcolor: 'purple', margin: '0 auto', width: '80px', height: '80px', fontSize: '24px' }}>A</Avatar>
          <br />
          <Typography style={{ fontSize: '24px', fontFamily: 'futura, sans serif' }}>
            Abeer
          </Typography>
          <br />
          <br />
        </Box>
      </Button>
    </main>
  )
}

export default Home
