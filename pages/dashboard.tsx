import React from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import umerCar from '../assets/g20.png';
import abeerCar from '../assets/gt.png';


const Dashboard: NextPage = () => {
    const [currUser, setCurrUser] = React.useState("");
    const [carWashUsed, setCarWashUsed] = React.useState(false);
    React.useEffect(() => {
        if (localStorage.getItem("user") == "umer") {
            setCurrUser("umer");
        }
        if (localStorage.getItem("user") == "abeer") {
            setCurrUser("abeer");
        }
    }, [])
    return (
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {currUser == "umer" && (
                <>
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', minWidth: '390px' }}>
                        <br />
                        <Typography style={{ textAlign: 'center', fontSize: '30px', fontFamily: 'futura, sans serif', fontWeight: '600' }}>
                            Welcome Umer
                        </Typography>
                        <br />
                    </Box>
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                        <br />
                        <br />
                        <Image src={umerCar} width="350" height="115" />
                        <br />
                        <Typography style={{ fontWeight: 'bold' }}>
                            2022 BMW 330i xDrive
                        </Typography>
                        <br />
                    </Box>
                </>
            )}
            {currUser == "abeer" && (
                <>
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', minWidth: '390px' }}>
                        <br />
                        <Typography style={{ textAlign: 'center', fontSize: '30px', fontFamily: 'futura, sans serif', fontWeight: '600' }}>
                            Welcome Abeer
                        </Typography>
                        <br />
                    </Box>
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                        <br />
                        <br />
                        <Image src={abeerCar} width="350" height="115" />
                        <br />
                        <Typography style={{ fontWeight: 'bold' }}>
                            2021 Ford Mustang GT
                        </Typography>
                        <br />
                    </Box>
                </>
            )}
            {!carWashUsed && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    <Typography style={{ fontFamily: 'Roboto, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        Car Wash has not been used
                        <br />
                        <Button variant="contained" style={{ width: '90%', height: '60px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claim</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            {carWashUsed && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    <Typography style={{ fontFamily: 'Roboto, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        Car Wash was used by Umer <br />come back tomorrow!
                        <br />
                        <Button variant="contained" disabled style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claimed</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
        </main>
    )
}

export default Dashboard
