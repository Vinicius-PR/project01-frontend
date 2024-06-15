'use client'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'

import ProductItem from '../components/ProductItem';
import { useEffect, useState } from 'react';
import ModalProduct from '../components/ModalProduct';

export interface ProductProps {
  id: string,
  name: string,
  category: string,
  status: string,
  price: number,
  rating: number,
  description: string,
  imageProductName: string,
  imageProductUrl: string
}

export default function Products() {

  const [products, setProducts] = useState<ProductProps[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false)
  }

  function updateProductsState() {
    fetch('http://localhost:8080/product')
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Added timestamp to the image url so i can change when change the image. By creating a new url.
      const timestamp = new Date().getTime(); 
      const products:ProductProps[] = data.data.map((product: ProductProps) => {
        return {
          ...product,
          imageProductUrl: `${product.imageProductUrl}?t=${timestamp}`
        }
      })
      setProducts(products)
    })
  }

  useEffect(() => {
    updateProductsState()
  }, [])

  return (
    <Box component='section' mb={4}>
      <Typography component='h1' variant='h4' sx={{mb: 3}}>Products</Typography>

      <Button 
        variant='contained' 
        sx={{mb: 2}} 
        onClick={() => {
          handleOpen()
        }}
      >
        Add new product
      </Button>
      <ModalProduct 
        mode='createNew' 
        isOpen={isOpen}
        product={null}
        handleClose={handleClose} 
        updateProductsState={updateProductsState}
      />
      {
        products === null ? (
          <h1>Loading Products...</h1>
        ) : (
          products.length === 0 ? (
            <h1>There is no product</h1>
          ) : (
            <Grid container spacing={2}>
              {
                products.map((product) => {
                  return (
                    <ProductItem key={product.id} product={product}/>
                  )
                })
              }
            </Grid>
          )
        )
      }
    </Box>
  )
}