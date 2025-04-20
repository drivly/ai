import { auth } from '@/app/(auth)/auth'
import { headers as requestHeaders } from 'next/headers'

export const getSession = async () => {
  try {
    const session = await auth()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const getUserAccounts = async () => {
  try {
    const session = await getSession()
    if (!session) {
      return [] // Skip API call for anonymous users
    }
    
    return []
  } catch (error) {
    console.error('Error getting user accounts:', error)
    return []
  }
}

export const getDeviceSessions = async () => {
  try {
    const session = await getSession()
    if (!session) {
      return [] // Skip API call for anonymous users
    }
    
    return []
  } catch (error) {
    console.error('Error getting device sessions:', error)
    return []
  }
}

export const currentUser = async () => {
  try {
    const session = await auth()
    if (!session?.user) {
      return null
    }
    
    return {
      ...session.user,
      collection: 'users'
    }
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
