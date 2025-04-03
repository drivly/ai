'use server'

import { getPayload } from '@/lib/auth/payload-auth'

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
  const payload = await getPayload()

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
