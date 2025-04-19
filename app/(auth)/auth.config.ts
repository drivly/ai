import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      
      const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                              nextUrl.pathname.startsWith('/account') ||
                              nextUrl.pathname.startsWith('/admin')
      
      const isAuthPage = nextUrl.pathname.startsWith('/sign-in') || 
                         nextUrl.pathname.startsWith('/sign-up') ||
                         nextUrl.pathname.startsWith('/api/auth')
      
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl))
      }
      
      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return Response.redirect(new URL('/sign-in', nextUrl))
      }
      
      return true
    },
  },
} satisfies NextAuthConfig
