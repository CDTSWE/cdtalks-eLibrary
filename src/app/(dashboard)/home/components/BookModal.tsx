'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'

import { toast } from 'react-toastify'

import { Controller, useForm } from 'react-hook-form'

import DialogCloseButton from '@/components/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'
import type { BookType } from '../types/bookType'
import { addBook, editBook } from '../actions'

type BookModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  editData?: BookType | null
  type: string
}

const genres = ['Fiction', 'Non-Fiction']

const BookModal = ({ open, setOpen, editData, type }: BookModalProps) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<BookType>({
    defaultValues: {
      title: '',
      author: '',
      description: '',
      genre: '',
      publication_year: ''
    }
  })

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        author: editData.author,
        description: editData.description,
        genre: editData.genre,
        publication_year: editData.publication_year
      })
    } else {
      reset(
        {
          title: '',
          author: '',
          description: '',
          genre: '',
          publication_year: ''
        },
        {
          keepValues: false
        }
      )
    }
  }, [editData, reset])

  const onSubmit = async (data: BookType) => {
    const newData: BookType = {
      id: editData?.id,
      title: data.title,
      author: data.author,
      description: data.description,
      genre: data.genre,
      publication_year: data.publication_year
    }

    if (type === 'edit') {
      // code goes here
    }

    const response = await addBook(newData)

    if (response) {
      toast.success('Book added successfully')
      reset()
      setOpen(false)
    }
  }

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {type === 'add' ? 'Add' : 'Edit'} Book Information
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Title'
                    placeholder='Title'
                    {...(errors.title && { error: true, helperText: 'Title is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='author'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Author'
                    placeholder='Author'
                    {...(errors.author && { error: true, helperText: 'Author is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='publication_year'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Publication Year'
                    placeholder='Publication Year'
                    {...(errors.publication_year && { error: true, helperText: 'Publication Year is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='genre'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Genre'
                    {...(errors.genre && { error: true, helperText: 'Genre is required' })}
                  >
                    {genres.map((genre, index) => (
                      <MenuItem key={index} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    multiline
                    maxRows={6}
                    fullWidth
                    label='Description'
                    placeholder='Description'
                    {...(errors.description && { error: true, helperText: 'Description is required' })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={() => handleClose()}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BookModal
