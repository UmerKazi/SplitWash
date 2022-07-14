import React from 'react'
import { Button, Modal, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import { useCarWash, getCarWash, logout, auth, getUserInfo, setCar } from '../firebase.js';
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import umerCar from '../assets/g20.png';
import abeerCar from '../assets/gt.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';


const Dashboard: NextPage = () => {
    const router = useRouter();
    const [currUser, setCurrUser] = React.useState("");
    const [carWashUsed, setCarWashUsed] = React.useState(false);
    const [carWashUser, setCarWashUser] = React.useState("");
    const [clicked, setClicked] = React.useState(false);
    const endDate = new Date('09/13/2022')
    const todayDate = new Date()
    todayDate.setTime(todayDate.getTime() + todayDate.getTimezoneOffset() * 60 * 1000);
    const offset = -240;
    const todayDateEST = new Date(todayDate.getTime() + offset * 60 * 1000);
    const stringDate = todayDateEST.toString();
    const today = todayDateEST.toISOString().slice(0, 10)
    const difference = endDate.getTime() - todayDate.getTime()
    const totalDays = Math.ceil(difference / (1000 * 3600 * 24))
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

    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = React.useState({});
    const [userCar, setUserCar] = React.useState("");
    const [userCarImg, setUserCarImg] = React.useState("");
    const [userCarWashGroup, setUserCarWashGroup] = React.useState("");
    const [setCarError, setSetCarError] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    React.useEffect(() => {
        if (loading) return;
        if (!user) router.push("/", undefined, { shallow: true });
        if (user) getUserInfo().then((res) => {
            setUserCarImg(res[0].carImg);
            setUserCar(res[0].car);
            console.log(userCarImg);
            console.log(userCar);
        })
    }, [user, loading]);

    const userName = user?.displayName;

    const [openSetCar, setOpenSetCar] = React.useState(false);

    const handleOpenSetCar = () => setOpenSetCar(true);
    const handleCloseSetCar = () => {
        setOpenSetCar(false);
    }

    const [setCarFormValues, setSetCarFormValues] = React.useState({
        year: '',
        make: '',
        model: '',
    });

    const handleSetCarChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setSetCarFormValues({ ...setCarFormValues, [prop]: event.target.value });
    };

    const handleSetUserCar = () => {
        if (setCarFormValues.make !== "" && setCarFormValues.model !== "" && setCarFormValues.year !== "") {
            setCar(setCarFormValues.make, setCarFormValues.model, setCarFormValues.year);
            setSetCarFormValues({ ...setCarFormValues, year: "", make: "", model: "" });
            handleCloseSetCar();
            setSetCarError("");
            router.push("/", undefined, { shallow: true });
        } else {
            setSetCarError("Please fill in all fields!")
        }
    }

    return (
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

            {/* Welcome Name Card */}

            <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', minWidth: '390px' }}>
                <br />
                <Typography style={{ textAlign: 'center', fontSize: '30px', fontFamily: 'futura, sans serif', fontWeight: '600' }}>
                    Welcome {userName}
                </Typography>
                <br />
            </Box>

            {/* User Car Card */}

            {userCar == "" && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        <Button onClick={handleOpenSetCar} variant="contained" style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', backgroundColor: '#2596be' }}>Set Your Car</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            {((userCar !== "") && (userCarImg)) && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    <br />
                    <br />
                    <Image src={userCarImg} width="350" height="115" />
                    <br />
                    <Typography style={{ fontWeight: 'bold' }}>
                        {userCar}
                    </Typography>
                    <br />
                </Box>
            )}

            {/* Car Wash Group Functions */}

            {userCarWashGroup == "" && (
                <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                    {/* Join Car Wash Group Card */}
                    <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        You Are Not Part Of A Group
                        <br />
                        <Button variant="contained" onClick={useWash} style={{ width: '90%', height: '60px', backgroundColor: "#75B08A", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Create</Button>
                        <br />
                        <Button variant="contained" onClick={useWash} style={{ width: '90%', height: '60px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Join</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            {userCarWashGroup !== "" && (
                <>
                    {/* Use Car Wash Card */}
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
                    {/* Used Car Wash Card */}
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
                    {/* Total Days Remaining Cards */}
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                        <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                            <br />
                            {totalDays} Days Remaining
                            <br />
                            <br />
                        </Typography>
                    </Box>
                </>
            )}

            {/* Log User Out Card */}

            <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                    <br />
                    <Button onClick={logout} variant="contained" style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', backgroundColor: '#D24335' }}>Log Out</Button>
                    <br />
                    <br />
                </Typography>
            </Box>
            <br />
            {/* Current System Time For Tracking Purposes */}
            <Typography style={{ width: '380px', textAlign: 'center', color: 'grey' }}>
                Current Time Is: {stringDate}
            </Typography>
            <br />
            <br />

            {/* Modals */}
            <Modal
                open={openSetCar}
                onClose={handleCloseSetCar}
                aria-labelledby="join-meeting"
                aria-describedby="join-meeting-desc"
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        borderRadius: '15px',
                        width: '390px'
                    }}
                >
                    <Typography
                        variant="h4"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '30px'
                        }}
                    >
                        Set Your Car
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={(e: { preventDefault: () => void; }) => { e.preventDefault(); }}
                        style={{
                            margin: '0 auto'
                        }}
                    >
                        <TextField
                            id="carYear"
                            label="Year"
                            variant="outlined"
                            style={{ width: '80%' }}
                            type={setCarFormValues.year}
                            value={setCarFormValues.year}
                            onChange={handleSetCarChange("year")}
                        />
                        <br />
                        <br />
                        <TextField
                            id="carMake"
                            label="Make"
                            variant="outlined"
                            style={{ width: '80%' }}
                            type={setCarFormValues.make}
                            value={setCarFormValues.make}
                            onChange={handleSetCarChange("make")}
                        />
                        <br />
                        <br />
                        <TextField
                            id="carModel"
                            label="Model"
                            variant="outlined"
                            style={{ width: '80%' }}
                            type={setCarFormValues.model}
                            value={setCarFormValues.model}
                            onChange={handleSetCarChange("model")}
                        />
                        <br />
                        <Button variant="contained" onClick={handleSetUserCar} style={{ width: '80%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Continue</Button>
                        <br />
                        {setCarError !== "" && (
                            <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px' }}>
                                {setCarError}
                            </p>
                        )}
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
        </main>
    )
}

export default Dashboard
