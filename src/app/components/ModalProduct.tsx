'use client'

import { FormEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Rating from '@mui/material/Rating'
import { ProductProps } from '../products/page'

interface ModalProductProps {
  product: ProductProps | null
  isOpen: boolean
  mode: 'createNew' | 'editProduct' | undefined,
  handleClose: () => void,
  updateProductsState?: () => void,
  getProduct?: () => void
}

const style = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  px: 4,
  py: 8,
};

export default function ModalProduct({ product, isOpen, mode, handleClose, updateProductsState, getProduct }:ModalProductProps) {
  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [price, setPrice] = useState<number | null>(null)
  const [rating, setRating] = useState<number | null>(0)
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (mode === 'editProduct' && product) {
      setName(product.name)
      setCategory(product.category)
      setStatus(product.status)
      setPrice(product.price)
      setRating(product.rating)
      setDescription(product.description)
    }
  }, [product])

  function resetInputs() {
    setName('')
    setCategory('')
    setStatus('')
    setPrice(null)
    setRating(0)
    setDescription('')
  }

  function createNewProduct(formData:any) {
    
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/product`, {
      method: 'POST',
      body: formData
    }).then(() => {
      if (updateProductsState)
        updateProductsState()
    }).catch((error) => {
      alert(`ERROR: ${error}`)
    })
  }

  function editProduct(formData:any, id: string | undefined) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/product/${id}`, {
      method: 'PUT',
      body: formData
    }).then(() => {
      if (getProduct)
        getProduct()
    }).catch((error) => {
      alert(`ERROR: ${error}`)
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (mode === 'createNew') {
      createNewProduct(formData)
    } else if (mode === 'editProduct' && product) {
      formData.append('imageProductName', product.imageProductName)
      editProduct(formData, product?.id)
    }
    
    resetInputs()
    handleClose()
  }

  return(
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="Create/edit a product"
      aria-describedby="Modal used to create or Edit a product"
    >
      <Box sx={style} component='form' autoComplete="off" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h3" component="h3">
          {
            mode === 'createNew' ? 'Add a new Product' : 'Edit Product'
          }
        </Typography>

        <Box>
          <label htmlFor="productImage">Select product Image</label><br/>
          <input
            required
            name='productImage'
            id='productImage'
            accept='image/*'
            type='file'
          />
        </Box>

        <TextField
          required 
          id="standard-basic" 
          label="Name"
          name='name'
          type='text' 
          variant="standard" 
          autoComplete='off'
          inputMode='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          required 
          id="standard-basic" 
          label="Category"
          name='category'
          type='text' 
          variant="standard" 
          autoComplete='off'
          inputMode='text'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <TextField
          required
          id="standard-basic" 
          label="Status"
          name='status'
          type='text' 
          variant="standard" 
          autoComplete='off'
          inputMode='tel'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <TextField
          required
          id="standard-basic" 
          label="Price"
          name='price'
          type='number' 
          variant="standard" 
          autoComplete='off'
          inputMode='numeric'
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <Rating
          aria-required='true'
          precision={0.5}
          name="rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />

        <TextareaAutosize
          required
          style={{padding: 2}}
          name='description'
          maxRows={9}
          minRows={5}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
          }}
        />

        {
          mode === 'createNew' ? (
            <Button variant='contained' type='submit'>Add</Button>
          ) : (
            <Button color='secondary' variant='contained' type='submit'>Edit</Button>
          )
        }
      </Box>
    </Modal>
  )
}