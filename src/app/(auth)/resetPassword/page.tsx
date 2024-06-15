'use client'

import {FormEvent, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { isEmail } from '@/utils/utils';


export default function ResetPassword() {
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorUserNotFound, setErrorUserNotFound] = useState({
    status: false,
    message: ''
  })
  const [success, setSuccess] = useState(false)

  function clearErros() {
    setErrorEmail(false)
    setErrorUserNotFound({
      status: false,
      message: ''
    })
  }

  async function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!isEmail(`${formData.get('email')}`)) {
      setErrorEmail(true)
      return
    }
    setErrorEmail(false)
    
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resetPassword`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email')?.toString().toLocaleLowerCase(),
      })
    }).then((response) => {
      console.log(response)
      
      if (response.ok) {
        setErrorUserNotFound({
          status: false,
          message: ''
        })
        setSuccess(true)
      } else {
        setErrorUserNotFound({
          status: true,
          message: 'User not found'
        })
      }
    })

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
          Reset Password
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
            onInput={clearErros}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={success}
          >
            Send link to Reset Password
          </Button>

          {
            errorUserNotFound.status && 
            <FormHelperText
              sx={{width: '100%' ,color: 'red', textAlign: 'center', fontSize: '0.9rem', border:'1px solid red'}}>
              {errorUserNotFound.message}
            </FormHelperText>
          }

          {
            success &&
            <Card sx={{ backgroundColor: 'lightgreen'}}>
              <CardContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography component={'h1'} sx={{fontSize: 20}} >
                  Email was sent
                </Typography>
              </CardContent>
            </Card>
          }
        
        </Box>
      </Box>

    </Container>
  );
}