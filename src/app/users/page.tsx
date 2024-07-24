'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import Link from 'next/link'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import ModalUser from '../components/ModalUser'

export interface UserProps {
  id: string
  name: string
  email: string
  phone: string
  job: string
  imageUserName: string
  imageUserUrl: string
}

export default function Users() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<UserProps[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  function handleOpen() {
    if (status === "unauthenticated") {
      alert('Need to login in to add an User')
      return
    }

    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false)
  }

  function updateUsersState() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      const users:UserProps[] = data.data.map((user: UserProps) => {
        return {
          ...user,
        }
      })
      setUsers(users)
    })
  }

  useEffect(() => {
    updateUsersState()
  }, [])

  return (
    <Box pb={5} component='section'>
      <Typography component='h1' variant='h4' sx={{mb: 3}}>Users</Typography>

      <Button 
        variant='contained' 
        sx={{mb: 2}} 
        onClick={() => {
          handleOpen()
        }}
      >
        Add new user
      </Button>

      <ModalUser 
        mode='createNew' 
        isOpen={isOpen}
        user={null}
        handleCloseModal={handleClose} 
        updateUsersState={updateUsersState}
      />
      {
        users === null ? (
          <h1>Loading Users...</h1>
        ) : (
          users.length === 0 ? (
            <h1>There is no user</h1>
          ) : (
            <TableContainer component={Paper} sx={{width: 'min-content'}}>
              <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontWeight: 'bold'}}>Name List</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    users.map((user) => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell padding='none' sx={{":hover": {backgroundColor: 'lightgray'}}}>
                            <Link 
                              href={`${process.env.NEXT_PUBLIC_APP_URL}/users/${user.id}`} 
                              style={{width: '100%', display: 'inline-block', height: '100%', padding: 12}}
                            >
                              {user.name}
                            </Link>
                          </TableCell>
                        </TableRow> 
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          )
        )
      }
    </Box>
  )
}