'use client'

import {FormEvent, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
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

export default function SignUp() {
  const router = useRouter()
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!isEmail(`${formData.get('email')}`)) {
      setErrorEmail(true)
      return
    }
    setErrorEmail(false)

    if (password1 !== password2) {
      setErrorPassword(true)
      return
    }
    setErrorPassword(false)

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        userName: formData.get('userName'),
        email: formData.get('email'),
        password: formData.get('password'),
      })
    })

    const responseJson = await response.json()

    if(response.ok) {
      router.push('/sign-in')
    } else {
      console.error('Error. Registration failed')
      setErrorMessage(responseJson.message)
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="userName"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errorEmail}
                helperText={errorEmail && "Email Invalid"}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errorPassword}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password1}
                onChange={(e) => {setPassword1(e.target.value)}}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errorPassword}
                helperText={errorPassword && 'Password does not match'}
                required
                fullWidth
                name="password2"
                label="Repeat Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                value={password2}
                onChange={(e) => {setPassword2(e.target.value)}}
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {
            errorMessage &&
            <FormHelperText 
              sx={{color: 'red', textAlign: 'center', fontSize: '0.9rem', border:'1px solid red'}}>
              {errorMessage}
            </FormHelperText>
          }
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}