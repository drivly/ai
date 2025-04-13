import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import type { Account, DeviceSession } from '@/lib/auth/types'
import { headers as requestHeaders } from 'next/headers'

export const getSession = async () => {
  try {
    const payload = await getPayloadWithAuth()
    const headers = await requestHeaders()
    if (!payload) {
      console.error('payload is not available')
      return null
    }
    if (!payload.betterAuth) {
      console.error('betterAuth is not available')
      return null
    }
    if (!payload.betterAuth.api) {
      console.error('betterAuth API not available')
      return null
    }
    const session = await payload.betterAuth.api.getSession({ headers })
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const getUserAccounts = async (): Promise<Account[]> => {
  try {
    const session = await getSession()
    if (!session) {
      return [] // Skip API call for anonymous users
    }
    
    const payload = await getPayloadWithAuth()
    const headers = await requestHeaders()
    if (!payload) {
      console.error('payload is not available for getUserAccounts')
      return []
    }
    if (!payload.betterAuth) {
      console.error('betterAuth is not available for getUserAccounts')
      return []
    }
    if (!payload.betterAuth.api) {
      console.error('betterAuth API not available for getUserAccounts')
      return []
    }
    const accounts = await payload.betterAuth.api.listUserAccounts({ headers })
    return accounts
  } catch (error) {
    console.error('Error getting user accounts:', error)
    return []
  }
}

export const getDeviceSessions = async (): Promise<DeviceSession[]> => {
  try {
    const payload = await getPayloadWithAuth()
    const headers = await requestHeaders()
    if (!payload) {
      console.error('payload is not available for getDeviceSessions')
      return []
    }
    if (!payload.betterAuth) {
      console.error('betterAuth is not available for getDeviceSessions')
      return []
    }
    if (!payload.betterAuth.api) {
      console.error('betterAuth API not available for getDeviceSessions')
      return []
    }
    const sessions = await payload.betterAuth.api.listDeviceSessions({ headers })
    return sessions
  } catch (error) {
    console.error('Error getting device sessions:', error)
    return []
  }
}

export const currentUser = async () => {
  try {
    const payload = await getPayloadWithAuth()
    const headers = await requestHeaders()
    if (!payload?.auth) {
      console.error('payload.auth not available for currentUser')
      return null
    }
    const { user } = await payload.auth({ headers })
    if (user?.collection === 'users') {
      return user
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const getContextProps = () => {
  const sessionPromise = getSession()
  const userAccountsPromise = getUserAccounts()
  const deviceSessionsPromise = getDeviceSessions()
  const currentUserPromise = currentUser()
  return { sessionPromise, userAccountsPromise, deviceSessionsPromise, currentUserPromise }
}
