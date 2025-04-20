'use server'

import { getPayloadWithAuth } from '@/lib/auth/payload-auth'

export async function signUp({ email, password, role, name, image }: { email: string; password: string; role: string; name: string; image?: string }) {
  try {
    const payload = await getPayloadWithAuth()

    const validRole = role === 'admin' || role === 'superAdmin' ? role : 'user'

    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: validRole,
        name,
        emailVerified: false,
      },
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    return new Response('Failed to create user', { status: 500 })
  }
}
