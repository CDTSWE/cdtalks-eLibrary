'use client'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import type { BookType } from '../types/bookType'

interface DeleteConfirmationDialogProps {
  open: boolean
  data: BookType | null
  onCancel: () => void
  onConfirm: () => void
}

const DeleteConfirmationDialog = ({ open, data, onCancel, onConfirm }: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Are you sure you want to delete the book: {data?.title}?</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant='outlined' color='error'>
          Cancel
        </Button>
        <Button className='text-white' type='submit' variant='contained' color='primary' onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
