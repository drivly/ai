'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Session } from 'next-auth'
import type { TypedUser } from 'payload'

type User = Extract<TypedUser, { collection: 'users' }>

type AuthContextType = {
  sessionPromise: Promise<Session | null>
  currentUserPromise: Promise<User | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  let context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({
  children,
  sessionPromise,
  currentUserPromise,
}: {
  children: ReactNode
  sessionPromise: Promise<Session | null>
  currentUserPromise: Promise<User | null>
}) {
  return <AuthContext.Provider value={{ sessionPromise, currentUserPromise }}>{children}</AuthContext.Provider>
}
