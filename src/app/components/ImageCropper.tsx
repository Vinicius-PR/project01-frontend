import {Modal ,Box, Button, Typography } from '@mui/material';
import { X } from '@mui/icons-material'
import { SyntheticEvent, useState, useRef } from 'react';

import ReactCrop, { PixelCrop, PercentCrop , centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import { createImageCropped } from '@/utils/utils';

interface ImageCropperProps {
  isSelectingImg: boolean
  imgSrc: string
  userId: string | undefined
  userImageName: string | undefined
  handleCloseModal: () => void
  handleClearImgSrcState: () => void
  updateUsersState: () => void
}

const minDimension = 100
const aspectRatio = 1

export default function ImageCropper({ isSelectingImg, imgSrc, userId, userImageName, handleCloseModal, handleClearImgSrcState, updateUsersState }: ImageCropperProps) {
  const [crop, setCrop] = useState<PercentCrop>()
  const [error, setError] = useState('')
  const imageElementRef = useRef<HTMLImageElement>(null)
  const canvasElementRef = useRef<HTMLCanvasElement>(null)

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const {width, height, naturalWidth, naturalHeight} = e.currentTarget
    if (error) {
      setError('')
    }
    if (naturalWidth < minDimension || naturalHeight < minDimension) {
      setError('Image must be at least 100 x 100 pixels')
      handleClearImgSrcState()
      return
    }
    // Getting width dynamically 
    const cropWidthInPercent = (minDimension / width) * 100

    const crop = makeAspectCrop(
    {
      unit: "%",
      width: cropWidthInPercent,
    }, 
    aspectRatio,
    width, 
    height
    )
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop)
  }

  function onSaveImageCrop() {
    if (imageElementRef.current === null || crop === undefined) {
      return
    }                
    createImageCropped({
      image: imageElementRef.current,
      canvas: canvasElementRef.current,
      crop: convertToPixelCrop(crop, 
        imageElementRef.current.width,
        imageElementRef.current.height
      )
    })

    canvasElementRef.current?.toBlob(async (blob: Blob | null) => {
      if (blob) {
        //Create the formData to send the file
        const formData = new FormData()
        formData.append('userImage', blob, userImageName)
        handleCloseModal()
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}/user/updateuserimage/${userId}`,{
            method: 'PUT',
            body: formData
          })

          if(response.ok) {
            console.log('Imagem sent successfully')
            updateUsersState()
          } else {
            console.error('Error sending the image', response.statusText)
          }
        } catch(error) {
          console.error('Network Error', error)
        }
      } else {
        console.error('Error trying to convert canvas to blob - image')
      }
    }, 'image/png')
  }

  return (
    <Modal
      open={isSelectingImg}
      onClose={handleCloseModal}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 2,
        marginBottom: 2
      }}
    >
      <Box
        border={'1px solid black'}
        sx={{
          backgroundColor: '#111f33',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '15px'
        }}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
          <Typography>Select the area you would like to use as a profile picture</Typography>
          <Button onClick={handleCloseModal}><X/></Button>
        </Box>
        
        {
          imgSrc && 
          (
            <>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <ReactCrop 
                  crop={crop}
                  circularCrop
                  keepSelection
                  aspect={aspectRatio}
                  minWidth={minDimension}
                  onChange={(pixelCrop, percentCrop) => {
                    setCrop(percentCrop)
                  }}
                >
                <img 
                  ref={imageElementRef}
                  src={imgSrc}
                  alt="Profile Image - Select the area" 
                  style={{maxHeight: '70vh'}}
                  onLoad={onImageLoad}
                /> 
              </ReactCrop>
            </Box>

            <Box
              marginTop={2}
              display={'flex'}
              justifyContent={'center'}
              gap={3}
            >
              <Button variant='contained' color='error' onClick={handleCloseModal}>Cancel</Button>
              <Button variant='contained' onClick={onSaveImageCrop}>Save</Button>
            </Box>
          </>
          )
        }
        {
          error && (
            <Typography color={'red'}>{error}</Typography>
          )
        }

        <canvas
          ref={canvasElementRef}
          style={{display: 'none'}}
        />
        
      </Box>
    </Modal>
  )
}