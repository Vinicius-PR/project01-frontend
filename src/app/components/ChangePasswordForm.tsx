'use client'

import { FormEvent, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';

interface ChangePasswordFormProps {
  userId: string
}

export default function ChangePasswordForm({userId}: ChangePasswordFormProps) {
  const router = useRouter()

  const [errorPassword, setErrorPassword] = useState(false)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  async function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (password1 !== password2) {
      setErrorPassword(true)
      return
    }
    setErrorPassword(false)

    //Change password here
    await fetch('http://localhost:3000/api/changePassword', {
      method: 'POST',
      body: JSON.stringify({
        newPassword: formData.get('password'),
        userId: userId
      })
    }).then((response) => {
      if (response.ok) {
        router.push('/sign-in')
      } else {
        throw new Error('Error changing password')
      }
    }).catch((error) => {
      console.error(error)
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
            Inform you new password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>            
  
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
                  onChange={(e) => {
                    setPassword1(e.target.value)
                    setErrorPassword(false)
                  }}
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
                  onChange={(e) => {
                    setPassword2(e.target.value)
                    setErrorPassword(false)
                  }}
                />
              </Grid>
  
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </Button>
          </Box>
        </Box>
  
      </Container>
  )
}