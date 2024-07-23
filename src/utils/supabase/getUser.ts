'use server'

import { createClient } from './server'

export async function getName() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (data) {
      const email = data.user?.user_metadata.email
      const name = data.user?.user_metadata.full_name

      return { email: email, name: name }
    } else {
      throw error
    }
  } catch (error) {
    console.log('Error getting user: ', error.message)
  }
}
