'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import Edit from '@mui/icons-material/Edit';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import avatarImgPlaceholder from '../../assets/user.png'
import Image from 'next/image'
import ModalUser from '@/app/components/ModalUser';
import { UserProps } from '../page'

export default function User({params} : {
  params: {userId: string}
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserProps | null>(null)
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File>()

  // console.log('file is', file)

  // State to check if is deleting.
  const [isDeleting, setIsDeleting] = useState(false)

  function handleEditUser() {
    if (status === "unauthenticated") {
      alert('Need to login to Delete/Edit User')
      return
    }
    if(user) {
      fetchUserImage(user.imageUserUrl, user.imageUserOriginalName)
    }
    setIsOpen(true)
  }

  function handleClose() {
    setIsOpen(false)
  }

  function getUser() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/${params.userId}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Added timestamp to the image url so i can change when change the image. By creating a new url.
      const timestamp = new Date().getTime(); 
      const user:UserProps = {
        ...data.data,
        imageUserUrl: `${data.data.imageUserUrl}?t=${timestamp}`
      }
      setUser(user)
    })
  }

  async function fetchUserImage(imageUrl: string, imageName: string) {
    await fetch(`${imageUrl}`, {
      headers: {
        'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_APP_URL}`
      }
    })
      .then((response) => {
        return response.blob()
      }).then((blob) => {
        const file = new File([blob], `${imageName}`, { type: blob.type })
        setFile(file)
      })
      .catch((error) => {
        console.error('Error getting image:', error)
      })
  }

  function deleteUser(id: string) {
    if (status === "unauthenticated") {
      alert('Need to login to Delete/Edit User')
      return
    }

    setIsDeleting(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setIsDeleting(false)
      router.push('/users')
    })
  }

  useEffect(() => {
    getUser()
  }, [getUser])

  return (
    <Box component='section'>

      <ModalUser
        mode='editUser'
        isOpen={isOpen}
        user={user}
        file={file}
        handleClose={handleClose} 
        updateUsersState={getUser}
      />

      <Button variant='contained' sx={{my:3}} onClick={() => router.push('/users')}>Go back</Button>

      {
        user === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <Box display={'flex'} alignItems={'center'}>
              <Image style={{borderRadius: '50%'}} width={100} height={100} src={user.imageUserUrl} alt='avatar image' />
              <Box marginLeft={3} display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>

                <Typography fontSize={20} component={'p'}>{user.name}</Typography>

                <Tooltip title="Edit">
                  <IconButton
                    onClick={handleEditUser}
                  >
                    <Edit
                      fontSize='large'
                      color='info' 
                      sx={{cursor: 'pointer', ":hover": { filter: 'brightness(0.7)' }}}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Divider sx={{my:3}} />

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Phone Number" secondary={user.phone} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Job" secondary={user.job} />
              </ListItem>
            </List>

            <Button disabled={isDeleting} size='large' variant='contained' color='error' sx={{my:3}} onClick={() => deleteUser(user.id)}>Delete</Button>
          </>
        )
      }
      

    </Box>
  )
}