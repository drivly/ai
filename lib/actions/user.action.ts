'use server'

import { User } from '@/payload.types'
import { headers } from 'next/headers'
import { cache } from 'react'
import { z } from 'zod'
import { getPayloadFn } from '../get-payload-fn'
import { getCurrentURL } from '../utils/url'

const UserApikeySchema = z.object({
  email: z.string().email().optional().nullable(),
  sub: z.string().optional().nullable(),
})

export const getUserApikeyAction = cache(async (params: z.infer<typeof UserApikeySchema>) => {
  try {
    const result = UserApikeySchema.safeParse(params)

    if (!result.success) {
      throw new Error('Invalid parameters')
    }

    const payload = await getPayloadFn()
    const userWithApikey = await payload.find({
      collection: 'apikeys',
      where: {
        or: [{ email: { equals: result.data.email } }, { user: { equals: result.data.sub } }],
      },
    })

    if (!userWithApikey.docs.length || !userWithApikey.docs[0]?.key) {
      throw new Error('User API key not found')
    }

    return userWithApikey.docs[0].apiKey
  } catch (error) {
    console.error(error)
    return null
  }
})

export const getUserById = cache(async (id: string) => {
  try {
    const payload = await getPayloadFn()
    const user = await payload.find({ collection: 'users', where: { id: { equals: id } } })

    if (!user.docs.length || !user.docs[0]) {
      throw new Error('User not found')
    }

    return user.docs[0]
  } catch (error) {
    console.error(error)
    return null
  }
})

export const updateUserById = async (id: string, data: Partial<User>) => {
  try {
    const payload = await getPayloadFn()
    await payload.update({ collection: 'users', id, data })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createUserApiKey = async (user: User) => {
  try {
    const payload = await getPayloadFn()
    const result = await payload.create({
      collection: 'apikeys',
      data: {
        user: user.id,
        email: user.email,
        name: user.name,
      },
    })

    if (!result || !result.apiKey) {
      throw new Error('User API key not found')
    }

    return result.apiKey
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getUserCredit = async () => {
  try {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)
    const res = await fetch(`${currentURL}/api/apikeys/credit`)
    const data = (await res.json()) as { credit?: number }

    if (!data.credit) {
      throw new Error('User credit not found')
    }

    return data.credit
  } catch (error) {
    console.error(error)
    return null
  }
}
