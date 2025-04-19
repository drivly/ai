import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // Empty array to satisfy NextAuthConfig type
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      
      const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                              nextUrl.pathname.startsWith('/account') ||
                              nextUrl.pathname.startsWith('/admin')
      
      const isAuthPage = nextUrl.pathname.startsWith('/api/auth/signin') || 
                         nextUrl.pathname.startsWith('/api/auth/signup')
      
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl))
      }
      
      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return Response.redirect(new URL('/api/auth/signin', nextUrl))
      }
      
      return true
    },
  },
} satisfies NextAuthConfig
