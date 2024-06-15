import productImg from '../assets/nintendo.png'

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating';

import Link from 'next/link'
import Image from 'next/image'
import { ProductProps } from '../products/page';

interface ProductItemComponentProps {
  product: ProductProps
}

export default function ProductItem({ product } : ProductItemComponentProps) {

  const imageStyle = {
    height: 'auto',
    maxHeight: '300',
    width: '100%',
    object: 'contain'
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardContent>
          <Image width={800} height={800} priority={true} style={imageStyle} src={product.imageProductUrl} alt={`product Image ${product.name}`} />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <Link href={`http://localhost:3000/products/${product.id}`}>{product.name}</Link>       
          </Typography>

          <Rating name="read-only" value={product.rating} readOnly precision={0.5} />
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {product.category}
          </Typography>

          <Typography variant="body2">
            {product.status}
          </Typography>

          <Typography variant="h5">
            R$ {(product.price).toFixed(2)}
          </Typography>

        </CardContent>
        <CardActions>
          <Link href={`http://localhost:3000/products/${product.id}`}>
            <Button size="small">See details</Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  )
}