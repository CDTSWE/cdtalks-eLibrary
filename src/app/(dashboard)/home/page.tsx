import { redirect } from 'next/navigation'

import { Grid } from '@mui/material'

import { createClient } from '@/utils/supabase/server'
import { getBooks } from './actions'

import type { BookType } from './types/bookType'
import LibraryTable from './components/LibraryTable'

export default async function Page() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: booksData } = await getBooks()

  const books = booksData as BookType[]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LibraryTable books={books} />
      </Grid>
    </Grid>
  )
}
