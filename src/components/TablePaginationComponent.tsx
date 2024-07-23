// Assuming you're using TypeScript, add generic typing
import React from 'react'

import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import type { Table } from '@tanstack/react-table'

interface TablePaginationComponentProps<T> {
  table: Table<T>
}

function TablePaginationComponent<T>({ table }: TablePaginationComponentProps<T>) {
  return (
    <div className='flex justify-between items-center flex-wrap p-6 gap-2'>
      <Typography color='text.disabled'>
        {`Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )} of ${table.getFilteredRowModel().rows.length} entries`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        count={Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)}
        page={table.getState().pagination.pageIndex + 1}
        onChange={(_, page) => table.setPageIndex(page - 1)}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
