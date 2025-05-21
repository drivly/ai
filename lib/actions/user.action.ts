'use server'

import { User } from '@/payload.types'
import { headers } from 'next/headers'
import { cache } from 'react'
import { z } from 'zod'
import { getPayloadFn } from '../get-payload-fn'
import { getCurrentURL } from '../utils/url'

/**
 * Fetches a user by their ID from the `users` collection.
 * @param id The ID of the user to fetch.
 * @returns A promise that resolves to the user object or null if not found or an error occurs.
 */
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

/**
 * Updates a user's information in the `users` collection by their ID.
 * @param id The ID of the user to update.
 * @param data The partial user data to update.
 * @returns A promise that resolves when the update is complete or null if an error occurs.
 */
export const updateUserById = async (id: string, data: Partial<User>) => {
  try {
    const payload = await getPayloadFn()
    await payload.update({ collection: 'users', id, data })
  } catch (error) {
    console.error(error)
    return null
  }
}

const UserApikeySchema = z.object({
  email: z.string().email().optional().nullable(),
  sub: z.string().optional().nullable(),
})

/**
 * Creates a new API key for a given user in the `apikeys` collection.
 * @param user The user object for whom to create the API key.
 * @returns A promise that resolves to the newly created API key string or null if an error occurs.
 */
export const createUserApikey = async (params: { email: string; name: string; id: string }) => {
  try {
    const payload = await getPayloadFn()
    const result = await payload.create({
      collection: 'apikeys',
      data: {
        email: params.email,
        name: params.name,
        user: params.id,
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

/**
 * Retrieves an existing API key for a user or creates a new one if none exists.
 * First checks the `apikeys` collection for a match based on email or user ID.
 * If found, returns the existing API key; otherwise, creates and returns a new one.
 *
 * @param user - The user object for whom to get or create an API key
 * @returns A Promise that resolves to the API key string or null if an error occurs
 */
export const getOrCreateUserApikey = async (params: { email: string; name: string; id: string }) => {
  try {
    const payload = await getPayloadFn()

    const existingResult = await payload.find({
      collection: 'apikeys',
      where: {
        or: [{ email: { equals: params.email } }, { user: { equals: params.id } }],
      },
      select: { apiKey: true },
    })

    if (existingResult.docs[0]?.apiKey) return existingResult.docs[0].apiKey

    return createUserApikey(params)
  } catch (error) {
    console.error(error)
    return null
  }
}

const CreditResponseSchema = z.object({
  credit: z.number().nullable().optional(),
})

/**
 * Fetches the current user's credit balance from the API.
 * @returns A promise that resolves to the user's credit balance (number), null, or undefined.
 */
export const getUserCredit = async ({ queryKey }: { queryKey: ['user-credit', string | undefined] }) => {
  const [, token] = queryKey
  try {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)

    const res = await fetch(`${currentURL}/api/apikeys/credit`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch user credit: ${res.status} ${res.statusText}`)
    }

    const rawData = await res.json()
    const result = CreditResponseSchema.safeParse(rawData)

    if (!result.success) {
      console.error('User credit data parsing failed:', result.error.errors[0].message)
      return null
    }

    return result.data.credit
  } catch (error) {
    console.error(error)
    return null
  }
}
