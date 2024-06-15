import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link'

export default async function Welcome() {
  
  return (

    <Card sx={{ textAlign:'center', backgroundColor: 'lightgreen', mt: 5}}>
      <CardContent>

        <Typography component={'h1'} sx={{ fontSize: 20 , mb: 2,}} >
          Congratulations, your acount is Active now.
        </Typography>
        
        <Button variant='contained' sx={{ mb: 1.5 }}>
          <Link style={{display:'inline-block', padding: '0.5rem'}} href={'/sign-in'}>
            Click here to log in
          </Link>
        </Button>
       
      </CardContent>
    </Card>
  )
}