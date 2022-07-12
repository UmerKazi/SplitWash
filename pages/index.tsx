import React from 'react'
import { Avatar, Button, Typography, TextField, Divider, Tabs, Tab } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router'

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

const Home: NextPage = () => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { background: '#2596be' } }} >
            <Tab label="Sign In" style={{ width: '190px', color: 'black' }} />
            <Tab label="Sign Up" style={{ width: '190px', color: 'black' }} />
          </Tabs>
        </Box>
        <br />
        <br />
        {value == 0 && (
          <>
            <Typography style={{ fontFamily: 'futura, sans serif', fontSize: '36px' }}>
              Sign In
            </Typography>
            <br />
            <br />
            <TextField variant="outlined" placeholder="Email Address" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField type="password" variant="outlined" placeholder="Password" style={{ width: '90%' }} />
            <br />
            <br />
            <Button variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}>Continue </Button>
            <br />
            <br />
            <Divider style={{ width: '80%', margin: '0 auto', color: 'grey' }}>OR</Divider>
            <br />
            <Button variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "white", color: 'black', fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}><GoogleIcon style={{ marginRight: '10px' }} />Sign In With Google</Button>
            <br />
            <br />
            <Typography style={{ color: "#2596be", textDecoration: 'underline' }}>Don&apos;t Have An Account? Sign Up Now!</Typography>
          </>
        )}
        {value == 1 && (
          <>
            <Typography style={{ fontFamily: 'futura, sans serif', fontSize: '36px' }}>
              Sign Up
            </Typography>
            <br />
            <br />
            <TextField variant="outlined" placeholder="First Name" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Last Name" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Email Address" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Phone Number" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField type="password" variant="outlined" placeholder="Password" style={{ width: '90%' }} />
            <br />
            <br />
            <Button variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}>Continue </Button>
            <br />
            <br />
            <Divider style={{ width: '80%', margin: '0 auto', color: 'grey' }}>OR</Divider>
            <br />
            <Button variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "white", color: 'black', fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}><GoogleIcon style={{ marginRight: '10px' }} />Sign Up With Google</Button>
            <br />
            <br />
            <Typography style={{ color: "#2596be", textDecoration: 'underline' }}>Already Have An Account? Sign In Now!</Typography>
          </>
        )}
        <br />
        <br />
        <br />
        <br />
      </Box>
      <br />
      <br />
    </main>
  )
}

export default Home
