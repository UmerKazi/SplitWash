import React from 'react'
import { Avatar, Button, Typography, TextField, Divider, Tabs, Tab } from '@mui/material'
import { Box } from '@mui/system'
import type { NextPage } from 'next'
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router'
import { registerWithEmailAndPassword, logInWithEmailAndPassword, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updatePhoneNumber } from 'firebase/auth';
import Link from 'next/link';

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

const Home: NextPage = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [isSubmit, setIsSubmit] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    if (user) router.push("/dashboard", undefined, { shallow: true });
  }, [user, loading]);

  const [signUpError, setSignUpError] = React.useState("");
  const [signInError, setSignInError] = React.useState("");
  const [globalError, setGlobalError] = React.useState(false);

  const [signUpFormValues, setSignUpFormValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [signInFormValues, setSignInFormValues] = React.useState({
    email: '',
    password: ''
  });

  const handleSignUpFormChange = (prop: string) => (event: { target: { value: any; }; }) => {
    setSignUpFormValues({ ...signUpFormValues, [prop]: event.target.value });
  };
  const handleSignInFormChange = (prop: string) => (event: { target: { value: any; }; }) => {
    setSignInFormValues({ ...signInFormValues, [prop]: event.target.value });
  };

  const resetFormValues = () => {
    setSignUpFormValues({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
    setSignInFormValues({ email: '', password: '' });
  }

  const validation = (values: any) => {
    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    const password = values.password;
    const phoneNumber = values.phoneNumber;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    let errorMessage = "";
    if (firstName.length <= 1) {
      errorMessage = "Your First Name Must Be Longer Than 1 Character!";
    } else if (lastName.length <= 1) {
      errorMessage = "Your Last Name Must Be Longer Than 1 Character!";
    } else if (!regex.test(email)) {
      errorMessage = "Invalid Email, Please Try Again!";
    } else if (phoneNumber.length !== 10) {
      errorMessage = "Your Phone Number Must Be 10 Digits";
    } else if (password.length <= 6) {
      errorMessage = "Your Password Must Be Longer Than 6 Characters!";
    }
    return errorMessage;
  }

  const signInValidation = (values: any) => {
    const email = values.email;
    const password = values.password;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    let errorMessage = "";
    if (!regex.test(email)) {
      errorMessage = "Invalid Email, Please Try Again!";
    } else if (password.length <= 6) {
      errorMessage = "Your Password Must Be Longer Than 6 Characters!";
    }
    return errorMessage;
  }

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCreateNewUser = () => {
    registerWithEmailAndPassword(signUpFormValues.email, signUpFormValues.password, signUpFormValues.firstName, signUpFormValues.lastName, signUpFormValues.phoneNumber);
  }

  const handleLogInUser = () => {
    logInWithEmailAndPassword(signInFormValues.email, signInFormValues.password);
  }

  const handleSignUpFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validation(signUpFormValues) == "") {
      handleCreateNewUser();
    } else {
      setSignUpError(validation(signUpFormValues));
    }
  }

  const handleSignInFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (signInValidation(signInFormValues) == "") {
      handleLogInUser();
    } else {
      setSignInError(signInValidation(signInFormValues));
    }
  }

  React.useEffect(() => {
    if (signInError == "" && signInFormValues.email !== "") {
      setIsSubmit(true);
    }
    if (signInError !== "") {
      setGlobalError(true);
    }
  }, [signInError])

  React.useEffect(() => {
    if (signUpError == "" && signUpFormValues.firstName !== "") {
      setIsSubmit(true);
    }
    if (signUpError !== "") {
      setGlobalError(true);
    }
  }, [signUpError])


  React.useEffect(() => {
    if (isSubmit && signUpError == "") {
      handleCreateNewUser();
    }
    if (isSubmit && signInError == "") {
      handleLogInUser();
    }
  })




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
            <TextField type={signInFormValues.email} value={signInFormValues.email} onChange={handleSignInFormChange("email")} variant="outlined" placeholder="Email Address" style={{ width: '90%' }} />
            <br />
            <br />
            <TextField type="password" value={signInFormValues.password} onChange={handleSignInFormChange("password")} variant="outlined" placeholder="Password" style={{ width: '90%' }} />
            <br />
            <br />
            <Button onClick={handleSignInFormSubmit} variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}>Continue </Button>
            <br />
            <br />
            <Typography style={{ color: "#2596be", textDecoration: 'underline' }}>Forgot Password?</Typography>
            {globalError && (
              <>
                <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px' }}>
                  {signInError}
                </p>
              </>
            )}
          </>
        )}
        {value == 1 && (
          <>
            <Typography style={{ fontFamily: 'futura, sans serif', fontSize: '36px' }}>
              Sign Up
            </Typography>
            <br />
            <br />
            <TextField variant="outlined" placeholder="First Name" onChange={handleSignUpFormChange("firstName")} type={signUpFormValues.firstName} value={signUpFormValues.firstName} style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Last Name" onChange={handleSignUpFormChange("lastName")} type={signUpFormValues.lastName} value={signUpFormValues.lastName} style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Email Address" onChange={handleSignUpFormChange("email")} type={signUpFormValues.email} value={signUpFormValues.email} style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Phone Number" onChange={handleSignUpFormChange("phoneNumber")} type={signUpFormValues.phoneNumber} value={signUpFormValues.phoneNumber} style={{ width: '90%' }} />
            <br />
            <br />
            <TextField variant="outlined" placeholder="Password" onChange={handleSignUpFormChange("password")} type="password" value={signUpFormValues.password} style={{ width: '90%' }} />
            <br />
            <br />
            <Button onClick={handleSignUpFormSubmit} variant="contained" style={{ width: '90%', height: '50px', backgroundColor: "#2596be", fontFamily: 'futura, sans serif', fontSize: '14px', letterSpacing: '3px' }}>Continue </Button>
            <br />
            <br />
            {globalError && (
              <>
                <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px' }}>
                  {signUpError}
                </p>
              </>
            )}
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
