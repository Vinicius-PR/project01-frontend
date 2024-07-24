'use client'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import {Box, Typography, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, IconButton, Tooltip, FormLabel, Input} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import Edit from '@mui/icons-material/Edit';

import avatarImgPlaceholder from '../../assets/user.png'

import Image from 'next/image'
import ModalUser from '@/app/components/ModalUser';
import ImageCropper from '@/app/components/ImageCropper'
import { UserProps } from '../page'

export default function User({params} : {
  params: {userId: string}
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserProps | null>(null)
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [imgSrc, setImgSrc] = useState('')
  const [isSelectingImg, setIsSelectingImg] = useState(false)

  // State to check if is deleting.
  const [isDeleting, setIsDeleting] = useState(false)

  function handleEditUser() {
    if (status === "unauthenticated") {
      alert('Need to login to Delete/Edit User')
      return
    }
    setIsOpenModalUser(true)
  }

  function handleCloseModalUser() {
    setIsOpenModalUser(false)
  }

  function handleCloseImageCropper() {
    setIsSelectingImg(false)
  }

  function handleClearImgSrcState() {
    setImgSrc('')
  }

  const getUser = useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/${params.userId}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      const user:UserProps = {
        ...data.data
      }
      setUser(user)
    })
  }, [params.userId])

  function createNewImageUrl() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/${params.userId}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Added timestamp to the image url so it can change when change the image. By creating a new url.
      const timestamp = new Date().getTime(); 
      const newUser:UserProps = {
        ...data.data,
        imageUserUrl: `${data.data?.imageUserUrl}?t=${timestamp}`
      }
      setUser(newUser)
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

  function onSelectFile(e:ChangeEvent<HTMLInputElement>) {
    const fileSelected = e.currentTarget.files?.[0]
    if (!fileSelected)
      return 

    // Check if the file is an image
    if (!fileSelected.type.startsWith('image/')) {
      console.error('Selected file is not an image.')
      alert('Selected file is not an image.')
      return
    }
    
    // Check if the file size exceeds 4MB
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB in bytes
    if (fileSelected.size > maxSizeInBytes) {
      console.error('Selected file is larger than 4MB.')
      alert('Selected file is larger than 4MB.')
      return
    }
    
    let reader = new FileReader();
    reader.readAsDataURL(fileSelected)
    reader.addEventListener('load', () => {
      const imageUrl = reader.result?.toString() || ''
      setImgSrc(imageUrl)
      setIsSelectingImg(true)
    })
    // Must reset the target.value to make the onChange event run when selecting the same image.
    e.target.value = ''
  }

  useEffect(() => {
    getUser()
  }, [getUser])

  return (
    <Box component='section'>
      <ModalUser
        mode='editUser'
        isOpen={isOpenModalUser}
        user={user}
        handleCloseModal={handleCloseModalUser} 
        updateUsersState={getUser}
      />

      <ImageCropper
        isSelectingImg={isSelectingImg}
        imgSrc={imgSrc}
        userId={user?.id}
        userImageName={user?.imageUserName}
        handleCloseModal={handleCloseImageCropper}
        handleClearImgSrcState={handleClearImgSrcState}
        updateUsersState={createNewImageUrl}
      />

      <Button variant='contained' sx={{my:3}} onClick={() => router.push('/users')}>Go back</Button>

      {
        user === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <Box 
              display={'flex'} 
              alignItems={'center'} 
              padding={'10px'}
              borderRadius={'20px'} 
              sx={{backgroundColor: 'lightblue'}}
            >
              <Box 
                position='relative'
                overflow='hidden'
                width='130px'
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                {
                  (user.imageUserUrl.startsWith('?t=') || user.imageUserUrl === '') ? (
                    <Image 
                      style={{borderRadius: '100%'}} width={100} height={100}
                      src={avatarImgPlaceholder.src}
                      alt='avatar image'
                      priority
                    />
                  ) : (
                    <Image 
                      style={{borderRadius: '100%'}} width={100} height={100} 
                      src={user.imageUserUrl} 
                      alt='avatar image'
                      priority
                    />
                  )
                }
                <input
                  name='userImage'
                  id='userImage'
                  accept='image/*'
                  type='file'
                  onChange={onSelectFile}
                  style={{
                    display: 'none'
                  }}
                />
                <FormLabel
                  htmlFor='userImage'
                  sx={{
                    opacity: 0,
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    borderRadius: '100%',
                    margin: '0 auto',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    fontSize: '14px',
                    padding: '0 10px',
                    cursor: 'pointer',
                    ":hover": {
                      opacity: 1
                    }
                  }}
                >
                  Image must be less than 4MB
                </FormLabel>

              </Box>
              <Box
                marginLeft={3} 
                display={'flex'} 
                justifyContent={'space-between'} 
                alignItems={'center'} 
                width={'100%'}
              >

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