'use server'

import { getPayloadAuth } from '@/lib/auth/payload-auth'

export async function signUp({
  email,
  password,
  role,
  name,
  image,
  //   callbackURL,
}: {
  email: string
  password: string
  role: string
  name: string
  image?: string
  //   callbackURL: string;
}) {
  const payload = await getPayloadAuth()

  const resFoo = await payload.betterAuth.api.createUser({
    asResponse: true,
    body: {
      email,
      password,
      role: 'admin',
      name,
    },
  })

  if (!resFoo.ok) {
    return new Response(resFoo.statusText, { status: resFoo.status })
  }
}
