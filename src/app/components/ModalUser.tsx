'use client'

import { FormEvent, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { UserProps } from '../users/page';
import { isEmail } from '@/utils/utils';

interface ModalUserProps {
  isOpen: boolean,
  mode: 'createNew' | 'editUser' | undefined,
  user: UserProps | null,
  handleCloseModal: () => void,
  updateUsersState: () => void
}

interface dataFormType {
  name: string,
  email: string,
  phone: string,
  job: string
}

const style = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  px: 4,
  py: 8,
};

export default function ModalUser({ isOpen, handleCloseModal: handleClose, updateUsersState, mode, user }: ModalUserProps) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [job, setJob] = useState('')

  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPhone, setErrorPhone] = useState(false)
  
  useEffect(() => {
    if (mode === 'editUser' && user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
      setJob(user.job)
    }
  }, [mode, user])  

  function isPhoneNumberComplete(phone: string) {
    // Number formated should have 14 or 15 character as:
    // Fix number: (12) 3333 5555
    // Cellphone number: (12) 99999 8888
    return phone.length >=14
  }

  function checkError() {
    let error1, error2

    if (!isEmail(email)) {
      setErrorEmail(true)
      error1 = true
    } else {
      setErrorEmail(false)
      error1 = false
    }

    if (!isPhoneNumberComplete(phone)) {
      setErrorPhone(true)
      error2 = true
    } else {
      setErrorPhone(false)
      error2 = false
    }

    return (error1 || error2) ? true : false

  }

  function resetInputs() {
    setName('')
    setEmail('')
    setPhone('')
    setJob('')
  }

  function createNewUser(dataForm:dataFormType) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    }).then(() => {
      updateUsersState()
    }).catch((error) => {
      alert(`ERROR: ${error}`)
    })
  }

  function editUser(dataForm:dataFormType, id: string) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    }).then(() => {
      updateUsersState()
    }).catch((error) => {
      alert(`ERROR: ${error}`)
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (checkError()) {
      return
    }
    const formData = new FormData(e.currentTarget)
    const dataForm:any = Object.fromEntries(formData)    

    if (mode === 'createNew') {
      createNewUser(dataForm)
    } else if (mode === 'editUser' && user) {
      editUser(dataForm, user.id)
    }

    // resetInputs()
    handleClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="Create/Edit User"
      aria-describedby="Modal used to create or edit an user"
    >
      <Box sx={style} component='form' autoComplete="off" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h3" component="h3">
          {
            mode === 'createNew' ? 'Add a new user' : 'Edit user'
          }
        </Typography>

        <TextField
          required 
          id="standard-basic" 
          label="Name"
          name="name"
          type='text' 
          variant="standard" 
          autoComplete='off'
          inputMode='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          error={errorEmail}
          helperText={errorEmail ? 'Email Invalid' : ''}
          required 
          id="standard-basic" 
          label="Email"
          name="email"
          type='email' 
          variant="standard" 
          autoComplete='off'
          inputMode='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          error={errorPhone}
          helperText={errorPhone ? 'Phone is Incomplete': ''}
          required
          id="standard-basic" 
          label="Phone"
          name="phone"
          type='tel' 
          variant="standard" 
          autoComplete='off'
          inputMode='tel'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLInputElement
            target.value = target.value
              .replace(/\D/g, '')
              .replace(/(\d{2})(\d{1})/, '($1) $2')
              .replace(/(\d{4})(\d{1})/, '$1-$2')
              .replace(/(\d{4})-(\d{1})(\d{4})/, '$1$2-$3')
              .replace(/(-\d{4})\d+?$/, '$1')
          }}
        />

        <TextField
          required 
          id="standard-basic" 
          label="Job"
          name="job"
          type='text' 
          variant="standard" 
          autoComplete='off'
          inputMode='text'
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />

        {
          mode === 'createNew' ? (
            <Button variant='contained' type='submit'>Add</Button>
          ) : (
            <Button color='secondary' variant='contained' type='submit'>Edit</Button>
          )
        }
      </Box>
    </Modal>
  )
}
