import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import WorkOS from 'next-auth/providers/workos'

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    WorkOS({
      clientId: process.env.WORKOS_CLIENT_ID || '',
      clientSecret: process.env.WORKOS_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    // jwt(params) {
    //   if (params.user) {
    //     params.token.id = params.user.id
    //     params.token.role = params.user.role || 'user'
    //   }
    //   return params.token
    // },
    // session(params) {
    //   if (params.session.user) {
    //     params.session.user.id = params.token.id as string
    //     params.session.user.role = params.token.role as string
    //   }
    //   return params.session
    // },
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user

    //   const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/account') || nextUrl.pathname.startsWith('/admin')

    //   const isAuthPage = nextUrl.pathname.startsWith('/api/auth/signin') || nextUrl.pathname.startsWith('/api/auth/signup')

    //   if (isLoggedIn && isAuthPage) {
    //     return Response.redirect(new URL('/', nextUrl))
    //   }

    //   if (isProtectedRoute) {
    //     if (isLoggedIn) return true
    //     return Response.redirect(new URL('/api/auth/signin', nextUrl))
    //   }

    //   return true
    // },
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig

export const {
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)
