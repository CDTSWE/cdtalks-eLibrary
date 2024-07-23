'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signInWithKeycloak() {
  const supabase = createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
      redirectTo: 'http://localhost:3000/auth/callback'
    }
  })

  if (data.url) {
    return redirect(data.url)
  }
}

export async function signOut() {
  const supabase = createClient()

  const session = await supabase.auth.getSession()
  const provider_token = session.data.session?.provider_token
  const refresh_token = session.data.session?.provider_refresh_token

  await supabase.auth.signOut()

  const logout_url = 'http://52.230.20.226:8080/realms/kalbe/protocol/openid-connect/logout'

  const bodyApi: { [key: string]: string } = {
    client_id: 'ews',
    client_secret: process.env.SUPABASE_AUTH_EXTERNAL_KEYCLOAK_SECRET
      ? process.env.SUPABASE_AUTH_EXTERNAL_KEYCLOAK_SECRET
      : '',
    refresh_token: refresh_token ? refresh_token : ''
  }

  const encodedBody = Object.keys(bodyApi)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(bodyApi[key]))
    .join('&')

  const res = await fetch(logout_url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + provider_token,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodedBody
  })

  console.log(res)

  return redirect('/login')
}
