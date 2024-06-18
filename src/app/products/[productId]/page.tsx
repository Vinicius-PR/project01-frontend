'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import productImg from '@/app/assets/nintendo.png'

import { ProductProps } from '../page'
import ModalProduct from '@/app/components/ModalProduct'

export default function Product({params} : {
  params: {productId: string}
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<ProductProps | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File>()

  // State to check if is deleting.
  const [isDeleting, setIsDeleting] = useState(false)

  function handleEditProduct() {
    if (status === "unauthenticated") {
      alert('Need to login to Delete/Edit Product')
      return
    }
    if (product) {
      fetchProductImage(product.imageProductUrl, product.imageProductOriginalName)
    }
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false)
  }

  async function fetchProductImage(imageUrl: string, imageName: string) {
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

  function getProduct() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/product/${params.productId}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Added timestamp to the image url so i can change when change the image. By creating a new url.
      const timestamp = new Date().getTime(); 
      const product:ProductProps = {
        ...data.data,
        imageProductUrl: `${data.data.imageProductUrl}?t=${timestamp}`
      }
      setProduct(product)
    })
  }

  function deleteProduct(id: string | undefined) {
    if (status === "unauthenticated") {
      alert('Need to login to Delete/Edit Product')
      return
    }
    setIsDeleting(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/product/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setIsDeleting(false)
      router.push('/products')
    })
  }

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <Box py={10} component='section'>
      <ModalProduct 
        mode='editProduct' 
        isOpen={isOpen} 
        handleClose={handleClose} 
        getProduct={getProduct} 
        product={product}
        file={file}
      />
      {
        product === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <Typography component='h1' variant='h4' sx={{mb: 3}}>{ product.name }</Typography>
            <Image width={350} height={350} priority={true} src={product.imageProductUrl} alt='product Image'/>
            
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

            <Typography variant="h4">
              Description
            </Typography>

            <Typography variant="body2">
              {product.description}
            </Typography>

            <Button sx={{mt:2}} size='large' variant='contained' onClick={() => router.push('/products')}> 
              Go back 
            </Button>

            <Box mt={5} display='flex' justifyContent='space-evenly'>
              <Button size='large' variant='contained' color='secondary' onClick={handleEditProduct}>Edit</Button>
              <Button disabled={isDeleting} size='large' variant='contained' color='error' onClick={() => deleteProduct(product.id)}>Delete</Button>
            </Box>
          </>
        )
      }
    </Box>
  )
}