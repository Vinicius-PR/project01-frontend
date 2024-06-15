import prisma from '@/lib/prisma';
import Button from '@mui/material/Button';
import ChangePasswordForm from '@/app/components/ChangePasswordForm';
import Link from 'next/link';

interface ChangePasswordProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ChangePassword({ searchParams }:ChangePasswordProps) {

  const token = searchParams?.token as string

  if (token) {
    const now = new Date()

    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: {
          gt: now // Check if resetPasswordTokenExpiry (created + 1 minute) date is greater than Now.
        }
      }
    })

    if(!user) {
      return (
        <div>
          <h1>INVALID TOKEN. Time expired</h1>
          <Button sx={{mt: 5}} variant='contained'>
            <Link href={'/resetPassword'}> Click here to reset password again </Link>
          </Button>
        </div>
      )
    }

    // If got here, is because there is a user
    return (
      <ChangePasswordForm userId={user.id}/>
    );
  }

  // Will go back to resetPassword page if there is no token
  return (
    <div>
      <h1>There is no Token</h1>
      <Button sx={{mt: 5}} variant='contained'>
        <Link href={'/resetPassword'}> Click here to reset password again </Link>
      </Button>
    </div>
  )
}