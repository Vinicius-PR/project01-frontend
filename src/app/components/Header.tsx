'use client'

import { MouseEvent, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import userImgPlaceholder from '@/app/assets/user.png'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const router = useRouter()

  const { data: session} = useSession()

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar sx={{mb: 1}} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 
          xs, extra-small: 0px
          md, medium: 900px 
          */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href={'/'}>LOGO</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Link href={'/users'}>Users</Link>
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Link href={'/products'}>Products</Link>
                </Typography>
              </MenuItem>

            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href={'/'}>LOGO</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <Link href={'/users'}>Users</Link>
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <Link href={'/products'}>Products</Link>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
           
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {
                  session?.user?.image ? (
                    <Image width={40} height={40} style={{borderRadius: '50%'}} alt="User Image" src={session?.user?.image} />
                  ) : (
                    <Image width={40} height={40} alt="User Image" src={userImgPlaceholder} />
                  )
                }
              </IconButton>
            </Tooltip>
              

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {
                session?.user ? (
                  [
                    <MenuItem key={'logout'} onClick={() => {
                      signOut()
                      handleCloseNavMenu()
                    }}>
                      <Typography textAlign="center">LogOut</Typography>
                    </MenuItem>,
                    <MenuItem key={'dashboard'} onClick={() => {
                      signOut()
                      handleCloseNavMenu()
                      // router.push(`${process.env.NEXT_PUBLIC_APP_URL}/user/details`)
                    }}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                  ]
                ) : (
                    [
                      <MenuItem key={'login'} onClick={() => {
                        handleCloseNavMenu()
                        handleCloseUserMenu()
                        router.push(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`)
                        }}>
                          <Typography textAlign="center">LogIn</Typography>
                      </MenuItem>,
                      <MenuItem key={'create-account'} onClick={() => {
                        handleCloseNavMenu()
                        handleCloseUserMenu()
                        router.push(`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`)
                        }}>
                          <Typography textAlign="center">Create Account</Typography>
                      </MenuItem>
                    ]
                )
              }
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}