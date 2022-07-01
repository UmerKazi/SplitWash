import React from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import { useCarWash, getCarWash } from '../firebase.js';
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import umerCar from '../assets/g20.png';
import abeerCar from '../assets/gt.png';


const Dashboard: NextPage = () => {
    const [currUser, setCurrUser] = React.useState("");
    const [carWashUsed, setCarWashUsed] = React.useState(false);
    const [carWashUser, setCarWashUser] = React.useState("");
    const [clicked, setClicked] = React.useState(false);
    const today = new Date().toISOString().slice(0, 10)
    const useWash = () => {
        setClicked(true);
        useCarWash(currUser);
    }
    React.useEffect(() => {
        if (localStorage.getItem("user") == "umer") {
            setCurrUser("umer");
        }
        if (localStorage.getItem("user") == "abeer") {
            setCurrUser("abeer");
        }
        getCarWash(today).then((res) => {
            if (res[0]?.used == true) {
                setCarWashUsed(true);
                if (res[0].name == "umer") {
                    setCarWashUser("Umer");
                }
                if (res[0].name == "abeer") {
                    setCarWashUser("Abeer");
                }
            }
        })
    }, [clicked])

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
                    <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        Car Wash Has Not Been Used
                        <br />
                        <Button variant="contained" onClick={useWash} style={{ width: '90%', height: '60px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claim</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            {carWashUsed && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        Car Wash Was Used By {carWashUser} <br />Come Back Tomorrow!
                        <br />
                        <Button variant="contained" disabled style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claimed</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            <br />
            <br />
        </main>
    )
}

export default Dashboard
