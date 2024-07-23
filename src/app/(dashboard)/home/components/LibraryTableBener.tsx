'use client'

import { useEffect, useState, useMemo } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import type { ColumnDef } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button, Divider, MenuItem, TablePagination, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import styles from '@core/styles/table.module.css'
import type { BookType } from '../types/bookType'
import OptionMenu from '@/@core/components/option-menu'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@/@core/components/mui/TextField'
import BookModal from './BookModal'
import DeleteConfirmationDialog from './DeleteConfirmationModal'
import { deleteBook } from '../actions'

const columnHelper = createColumnHelper<BookType>()

type StateType = {
  data: BookType[]
  selectedData: BookType | null
  searchQuery: string
  selectedGenre: string
  isModalOpen: boolean
  modalType: string
  isDeleteModalOpen: boolean
}

const initialState: StateType = {
  data: [],
  selectedData: null,
  searchQuery: '',
  selectedGenre: '',
  isModalOpen: false,
  isDeleteModalOpen: false,
  modalType: ''
}

const LibraryTable = ({ books }: { books: BookType[] }) => {
  const [state, setState] = useState<StateType>(initialState)

  const columns = useMemo<ColumnDef<BookType, string>[]>(
    () => [
      columnHelper.accessor('title', { cell: info => info.getValue(), header: 'Title' }),
      columnHelper.accessor('author', { cell: info => info.getValue(), header: 'Author' }),
      columnHelper.accessor('publication_year', { cell: info => info.getValue(), header: 'Publication Year' }),
      columnHelper.accessor('genre', {
        header: 'Genre',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Typography>{row.original.genre}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('description', { cell: info => info.getValue(), header: 'Description' }),
      columnHelper.accessor('actions', {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: {
                    onClick: () => handleModalOpen('edit', row.original)
                  }
                },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: { onClick: () => handleOpenDeleteModal(row.original) }
                }
              ]}
            />
          </div>
        )
      })
    ],
    []
  )

  useEffect(() => {
    setState(prevState => ({ ...prevState, data: books }))
  }, [books])

  const handleModalOpen = (type: string, data?: BookType) => {
    setState(prevState => ({ ...prevState, selectedData: data || null, isModalOpen: true, modalType: type }))
  }

  const handleModalClose = () => {
    setState(prevState => ({ ...prevState, isModalOpen: false, selectedData: null, modalType: '' }))
  }

  const handleDeleteModalClose = () => {
    setState(prevState => ({ ...prevState, selectedData: null, isDeleteModalOpen: false }))
  }

  const handleOpenDeleteModal = async (data: BookType) => {
    setState(prevState => ({ ...prevState, selectedData: data, isDeleteModalOpen: true }))
  }

  // akan dijadiin bahan
  const filteredBooks = useMemo(
    () =>
      state.data.filter(
        book =>
          book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
          (state.selectedGenre ? book.genre === state.selectedGenre : true)
      ),
    [state.data, state.searchQuery, state.selectedGenre]
  )

  // akan jadi bahan
  const handleDelete = async (id: any) => {
    const res = await deleteBook(id)

    if (res) {
      toast.success('Book deleted successfully')
    } else {
      toast.error('Failed to delete book. Please try agaim')
    }

    setState(prevState => ({ ...prevState, selectedData: null, isDeleteModalOpen: false }))
  }

  const table = useReactTable({
    data: filteredBooks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } }
  })

  return (
    <>
      <Card>
        <CardHeader title='e-Library' />
        <Divider />
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <CustomTextField
            placeholder='Search books...'
            onChange={e => setState(prevState => ({ ...prevState, searchQuery: e.target.value }))}
          />
          <div className='flex flex-wrap items-center gap-4'>
            {/* akan jadi bahan */}
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto is-[70px]'
            >
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='15'>15</MenuItem>
            </CustomTextField>

            {/* akan jadi bahan */}
            <CustomTextField
              select
              value={state.selectedGenre}
              onChange={e => setState(prevState => ({ ...prevState, selectedGenre: e.target.value }))}
              className='flex-auto is-[150px]'
            >
              <MenuItem value=''>No Filter</MenuItem>
              <MenuItem value='Fiction'>Fiction</MenuItem>
              <MenuItem value='Non-Fiction'>Non-Fiction</MenuItem>
            </CustomTextField>

            <Button
              variant='contained'
              onClick={() => handleModalOpen('add')}
              startIcon={<i className='tabler-plus' />}
            >
              Add Product
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
      <BookModal
        open={state.isModalOpen}
        setOpen={handleModalClose}
        editData={state.selectedData}
        type={state.modalType}
      />
      <DeleteConfirmationDialog
        open={state.isDeleteModalOpen}
        data={state.selectedData}
        onCancel={handleDeleteModalClose}
        onConfirm={() => handleDelete(state.selectedData?.id)}
      />
    </>
  )
}

export default LibraryTable
