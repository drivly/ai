'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Session } from 'next-auth'
import type { TypedUser } from 'payload'

type User = Extract<TypedUser, { collection: 'users' }>

type UserContextType = {
  sessionPromise: Promise<Session | null>
  userAccountsPromise: Promise<any[] | null>
  deviceSessionsPromise: Promise<any[] | null>
  currentUserPromise: Promise<User | null>
}

const AuthContext = createContext<UserContextType | null>(null)

export function useAuth(): UserContextType {
  let context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useBetterAuth = useAuth

export function AuthProvider({
  children,
  sessionPromise,
  userAccountsPromise,
  deviceSessionsPromise,
  currentUserPromise,
}: {
  children: ReactNode
  sessionPromise: Promise<Session | null>
  userAccountsPromise: Promise<any[] | null>
  deviceSessionsPromise: Promise<any[] | null>
  currentUserPromise: Promise<User | null>
}) {
  return <AuthContext.Provider value={{ sessionPromise, userAccountsPromise, deviceSessionsPromise, currentUserPromise }}>{children}</AuthContext.Provider>
}

export const BetterAuthProvider = AuthProvider
