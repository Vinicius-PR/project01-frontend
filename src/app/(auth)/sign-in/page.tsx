'use client'

import { useSession } from "next-auth/react"

import {FormEvent, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isEmail } from '@/utils/utils';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function SignIn() {
  const { data: session, status} = useSession()
  const router = useRouter()
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorSingIn, setErrorSignIn] = useState({
    status: false,
    message: ''
  })

  async function signInWithGoogle() {
    const singInData = await signIn('google', {
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
    })

    if (singInData?.error) {
      setErrorSignIn({
        status: true,
        message: 'Error to sign-in with google.'
      })
    } else {
      router.push('/')
    }
  }

  async function signInWithGithub() {
    const singInData = await signIn('github', {
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
    })

    console.log(singInData)

    if (singInData?.error) {
      setErrorSignIn({
        status: true,
        message: 'Error to sign-in with github.'
      })
    } else {
      router.push('/')
    }
  }

  async function  handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!isEmail(`${formData.get('email')}`)) {
      setErrorEmail(true)
      return
    }
    setErrorEmail(false)
    

    const singInData = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false
    })

    console.log('singInData is', singInData)
    
    if (singInData?.error === "CredentialsSignin") {
      setErrorSignIn({
        status: true,
        message: 'Email/password Invalid'
      })
    } else if (singInData?.error === "User is not active") {
      setErrorSignIn({
        status: true,
        message: 'User is not active. Check your email.'
      })
    } else {
      setErrorSignIn({
        status: false,
        message: ''
      })
      router.push('/')
    }
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
          
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            error={errorEmail}
            helperText={errorEmail && "Email Invalid"}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          {
            errorSingIn.status && 
            <FormHelperText 
              sx={{color: 'red', textAlign: 'center', fontSize: '0.9rem', border:'1px solid red'}}>
              {errorSingIn.message}
            </FormHelperText>
          }

          <Grid container>
            <Grid item xs>
              <Link href="/resetPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>


        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, display: 'flex', gap: '1rem' , backgroundColor: 'lightgray', color: 'green', ":hover" : {
            backgroundColor: 'white'
          }}}
          onClick={signInWithGoogle}
        >
          <p>Sign In with google</p> <GoogleIcon sx={{fontSize: '1.2rem'}} />
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, display: 'flex', gap: '1rem' , backgroundColor: 'darkcyan', color: 'white', ":hover" : {
            backgroundColor: 'white',
            color: 'darkcyan'
          }}}
          onClick={signInWithGithub}
        >
          <p>Sign In with GitHub</p> <GitHubIcon sx={{fontSize: '1.2rem'}} />
        </Button>

      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}