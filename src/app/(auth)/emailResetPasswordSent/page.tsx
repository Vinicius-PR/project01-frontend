import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function EmailResetPasswordSent() {
  return (
    <Card sx={{ textAlign:'center', backgroundColor: 'lightgreen', mt: 5}}>
      <CardContent>

        <Typography component={'h1'} sx={{ fontSize: 20 , mb: 2,}} >
          Your email was sent
        </Typography>
        
        <Typography sx={{ mb: 1.5 }}>
          Check your email to reset your password
        </Typography>
       
      </CardContent>
    </Card>
  )
}