import React from 'react'
import { Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import { useCarWash, getCarWash, logout, auth, getUserInfo, setCar, createGroup, joinGroup, verifyGroup, getGroupInfo } from '../firebase.js';
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function addDays(date: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + 90);
    return result;
}

const Dashboard: NextPage = () => {
    const router = useRouter();
    const [currUser, setCurrUser] = React.useState("");
    const [carWashUser, setCarWashUser] = React.useState("");

    // firebase

    const [user, loading, error] = useAuthState(auth);
    const userName = user?.displayName;

    const [userCar, setUserCar] = React.useState("");
    const [userCarImg, setUserCarImg] = React.useState("");
    const [userCarWashGroup, setUserCarWashGroup] = React.useState("");
    const [groupAdminName, setGroupAdminName] = React.useState("");
    const [groupDateBought, setGroupDateBought] = React.useState("");
    const [groupUsername, setGroupUsername] = React.useState("");
    const [groupPassword, setGroupPassword] = React.useState("");
    const [groupMembers, setGroupMembers] = React.useState<Array<any>>([]);
    const [groupMembersInfo, setGroupMembersInfo] = React.useState([]);
    const [groupCarWashUsed, setGroupCarWashUsed] = React.useState(false);
    const [groupCarWashUser, setGroupCarWashUser] = React.useState("");

    const [setCarError, setSetCarError] = React.useState("");
    const [createGroupError, setCreateGroupError] = React.useState("");
    const [joinGroupError, setJoinGroupError] = React.useState("");

    const [setCarFormValues, setSetCarFormValues] = React.useState({
        year: '',
        make: '',
        model: '',
    });

    const [createGroupFormValues, setCreateGroupFormValues] = React.useState({
        username: "",
        password: "",
    })

    const [joinGroupFormValues, setJoinGroupFormValues] = React.useState({
        groupID: "",
    })

    const [dateBought, setDateBought] = React.useState<Date | null>(new Date());

    const [openSetCar, setOpenSetCar] = React.useState(false);
    const handleOpenSetCar = () => setOpenSetCar(true);
    const handleCloseSetCar = () => {
        setOpenSetCar(false);
    }
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

    const [openCreateGroup, setOpenCreateGroup] = React.useState(false);
    const handleOpenCreateGroup = () => setOpenCreateGroup(true);
    const handleCloseCreateGroup = () => {
        setOpenCreateGroup(false);
    }
    const handleChangeCreateGroup = (prop: string) => (event: { target: { value: any; }; }) => {
        setCreateGroupFormValues({ ...createGroupFormValues, [prop]: event.target.value });
    };
    const handleCreateGroup = () => {
        if (createGroupFormValues.username !== "" && createGroupFormValues.password !== "") {
            const date = dateBought?.toISOString().slice(0, 10).split('-').join('/');
            createGroup(date, createGroupFormValues.username, createGroupFormValues.password);
            setCreateGroupFormValues({ username: "", password: "" })
            handleCloseCreateGroup();
            setCreateGroupError("");
            router.push("/", undefined, { shallow: true });
        } else {
            setCreateGroupError("Please fill in all fields!");
        }
    }

    const [openJoinGroup, setOpenJoinGroup] = React.useState(false);
    const handleOpenJoinGroup = () => setOpenJoinGroup(true);
    const handleCloseJoinGroup = () => {
        setOpenJoinGroup(false);
    }
    const handleChangeJoinGroup = (prop: string) => (event: { target: { value: any; }; }) => {
        setJoinGroupFormValues({ ...joinGroupFormValues, [prop]: event.target.value });
    };
    const handleJoinGroup = () => {
        if (joinGroupFormValues.groupID !== "") {
            verifyGroup(joinGroupFormValues.groupID).then((res) => {
                if (res == true) {
                    joinGroup(joinGroupFormValues.groupID);
                    setJoinGroupFormValues({ groupID: "" })
                    handleCloseJoinGroup();
                    setJoinGroupError("");
                    router.push("/", undefined, { shallow: true });
                } else {
                    setJoinGroupError("Group ID Invalid");
                }
            })

        } else {
            setJoinGroupError("Please Fill In All Fields!");
        }
    }

    const endDate = addDays(groupDateBought);
    const todayDate = new Date()
    todayDate.setTime(todayDate.getTime() + todayDate.getTimezoneOffset() * 60 * 1000);
    const offset = -240;
    const todayDateEST = new Date(todayDate.getTime() + offset * 60 * 1000);
    const stringDate = todayDateEST.toString();
    const today = todayDateEST.toISOString().slice(0, 10).split('-').join('/');
    const difference = endDate.getTime() - todayDate.getTime()
    const totalDays = Math.ceil(difference / (1000 * 3600 * 24))

    React.useEffect(() => {
        if (loading) return;
        if (!user) router.push("/", undefined, { shallow: true });
        if (user) {
            getUserInfo(user.uid).then((res) => {
                setUserCarImg(res[0].carImg);
                setUserCar(res[0].car);
                setUserCarWashGroup(res[0].group);
            })
            if (userCarWashGroup) {
                getGroupInfo(userCarWashGroup).then((res) => {
                    setGroupAdminName(res[0].adminName);
                    setGroupDateBought(res[0].dateBought);
                    setGroupUsername(res[0].userName);
                    setGroupPassword(res[0].password);
                    setGroupMembers(res[0].members);
                })
                getCarWash(today, userCarWashGroup).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        if (res[0][i].toString().split('-')[0] == today) {
                            setGroupCarWashUsed(true);
                            setGroupCarWashUser(res[0][i].toString().split('-')[1]);
                        }
                    }
                });


            }
        }

    }, [user, loading]);

    const useWash = () => {
        useCarWash(today, userCarWashGroup);
    }

    return (
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

            {/* Welcome Name Card **Done** */}

            <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', minWidth: '390px' }}>
                <br />
                <Typography style={{ textAlign: 'center', fontSize: '30px', fontFamily: 'futura, sans serif', fontWeight: '600' }}>
                    Welcome {userName}
                </Typography>
                <br />
            </Box>

            {/* User Car Card **Done** */}
            {/* !! Add Change Car Functionality !! */}

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
                    <Box component="img" src={userCarImg} sx={{ width: 380 }} />
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
                    {/* Join/Create Car Wash Group Card **Done** */}
                    <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                        <br />
                        You Are Not Part Of A Group
                        <br />
                        <Button variant="contained" onClick={handleOpenCreateGroup} style={{ width: '90%', height: '60px', backgroundColor: "#75B08A", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Create</Button>
                        <br />
                        <Button variant="contained" onClick={handleOpenJoinGroup} style={{ width: '90%', height: '60px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Join</Button>
                        <br />
                        <br />
                    </Typography>
                </Box>
            )}
            {userCarWashGroup !== "" && (
                <>
                    {/* Use Car Wash Card */}
                    {!groupCarWashUsed && (
                        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                            <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                                <br />
                                Use The Car Wash Today!
                                <br />
                                <Button variant="contained" onClick={useWash} style={{ width: '90%', height: '60px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claim</Button>
                                <br />
                                <br />
                            </Typography>
                        </Box>
                    )}
                    {/* Used Car Wash Card */}
                    {groupCarWashUsed && (
                        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                            <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                                <br />
                                Car Wash Was Used<br /> By {groupCarWashUser} <br />Come Back Tomorrow!
                                <br />
                                <Button variant="contained" disabled style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px' }}>Claimed</Button>
                                <br />
                                <br />
                            </Typography>
                        </Box>
                    )}
                    {/* Group Info */}
                    {/* Leave Group Functionality */}

                    {groupAdminName == user?.displayName && (
                        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                            <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                                <br />
                                My Group
                                <br />
                            </Typography>
                            <br />
                            {groupMembers.map((displayName, index) => (
                                <>
                                    <Box key={displayName} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', margin: "0 auto", textAlign: 'center', width: '300px', height: '60px' }}>
                                        <Stack direction="row">
                                            <Avatar style={{ marginLeft: '40px', marginTop: '10px' }}>{displayName[0]}</Avatar>
                                            <Typography style={{ marginLeft: '30px', marginTop: '18px' }} >{displayName}</Typography>
                                        </Stack>
                                    </Box>
                                    <br />
                                </>
                            ))}
                            <br />

                        </Box>
                    )}
                    {groupAdminName !== user?.displayName && (
                        <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                            <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                                <br />
                                {groupAdminName}&apos;s Group
                                <br />
                            </Typography>
                            <br />
                            {groupMembers.map((displayName, index) => (
                                <>
                                    <Box key={displayName} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', margin: "0 auto", textAlign: 'center', width: '300px', height: '60px' }}>
                                        <Stack direction="row">
                                            <Avatar style={{ marginLeft: '40px', marginTop: '10px' }}>{displayName[0]}</Avatar>
                                            <Typography style={{ marginLeft: '30px', marginTop: '18px' }} >{displayName}</Typography>
                                        </Stack>
                                    </Box>
                                    <br />
                                </>
                            ))}
                            <br />
                        </Box>
                    )}

                    {/* Days Remaining */}
                    <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                        <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                            <br />
                            {totalDays} Days Remaining
                            <br />
                            <br />
                        </Typography>
                    </Box>
                </>
            )
            }

            {/* Log User Out Card **Done** */}

            <Box style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '15px', marginLeft: '15px', marginRight: '15px', marginTop: '20px', textAlign: 'center', width: '390px' }}>
                <Typography style={{ fontFamily: 'Futura, sans serif', fontSize: '24px', marginLeft: '15px', marginRight: '15px' }}>
                    <br />
                    <Button onClick={logout} variant="contained" style={{ width: '90%', height: '60px', fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', backgroundColor: '#D24335' }}>Log Out</Button>
                    <br />
                    <br />
                </Typography>
            </Box>
            <br />
            {/* Current System Time For Tracking Purposes **Done** */}
            <Typography style={{ width: '380px', textAlign: 'center', color: 'grey' }}>
                Current Time Is: {stringDate}
            </Typography>
            <br />
            <br />

            {/* Modals */}

            {/* Set Your Car **Done** */}

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

            {/* Create Group */}

            <Modal
                open={openCreateGroup}
                onClose={handleCloseCreateGroup}
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
                        Create Group
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={(e: { preventDefault: () => void; }) => { e.preventDefault(); }}
                        style={{
                            margin: '0 auto',
                            textAlign: 'left'
                        }}
                    >


                        <FormControl style={{ textAlign: 'left', marginLeft: '38px' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Subscription Provider</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="petro"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="petro" control={<Radio />} label="Petro Canada" />
                            </RadioGroup>
                        </FormControl>

                        <br />
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                label="Subscription Purchase Date"
                                value={dateBought}
                                onChange={(newValue) => {
                                    setDateBought(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} style={{ width: '80%', marginLeft: '38px' }} />}
                            />
                        </LocalizationProvider>
                        <br />
                        <br />
                        <Typography
                            style={{
                                fontSize: '16px',
                                paddingLeft: '38px',
                                paddingRight: '38px'
                            }}
                        >
                            In order for other group members to access the Petro Canada app, please fill in your login information:
                        </Typography>
                        <br />
                        <TextField
                            id="username"
                            label="Email"
                            variant="outlined"
                            style={{ width: '80%', marginLeft: '38px' }}
                            type={createGroupFormValues.username}
                            value={createGroupFormValues.username}
                            onChange={handleChangeCreateGroup("username")}
                        />
                        <br />
                        <br />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            style={{ width: '80%', marginLeft: '38px' }}
                            type="password"
                            value={createGroupFormValues.password}
                            onChange={handleChangeCreateGroup("password")}
                        />
                        <br />
                        <br />
                        <Button variant="contained" onClick={handleCreateGroup} style={{ width: '80%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px', marginLeft: '38px' }}>Continue</Button>
                        <br />
                        {createGroupError !== "" && (
                            <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px', textAlign: 'center' }}>
                                {createGroupError}
                            </p>
                        )}
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>

            {/* Join Group */}
            <Modal
                open={openJoinGroup}
                onClose={handleCloseJoinGroup}
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
                        Join Group
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={(e: { preventDefault: () => void; }) => { e.preventDefault(); }}
                        style={{
                            margin: '0 auto',
                            textAlign: 'left'
                        }}
                    >
                        <TextField
                            id="groupID"
                            label="Group ID"
                            variant="outlined"
                            style={{ width: '80%', marginLeft: '38px' }}
                            type={joinGroupFormValues.groupID}
                            value={joinGroupFormValues.groupID}
                            onChange={handleChangeJoinGroup("groupID")}
                        />
                        <br />
                        <Button variant="contained" onClick={handleJoinGroup} style={{ width: '80%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '18px', letterSpacing: '3px', marginTop: '15px', marginLeft: '38px' }}>Continue</Button>
                        <br />
                        {createGroupError !== "" && (
                            <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px', textAlign: 'center' }}>
                                {createGroupError}
                            </p>
                        )}
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
        </main >
    )
}

export default Dashboard
