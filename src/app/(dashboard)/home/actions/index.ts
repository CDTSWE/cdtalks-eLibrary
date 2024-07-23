'use server'

import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import type { BookType } from '../types/bookType'

const tableName = process.env.SUPABASE_TABLE_NAME

export const getBooks = async () => {
  noStore()

  const supabase = createClient()

  return await supabase.from(`${tableName}`).select('*')
}

export const addBook = async (newData: BookType) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from(`${tableName}`).insert([newData]).select()

    if (data) {
      revalidatePath('/home')

      console.log('Data inserted successfully')

      return JSON.stringify(data)
    }

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error adding book:', error)
  }
}

export const editBook = async (id: string, newData: BookType) => {
  console.log('EDIT BOOK')
}

export const deleteBook = async (id: string) => {
  console.log('DELETE BOOK')
}
