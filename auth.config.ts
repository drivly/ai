import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import WorkOS from 'next-auth/providers/workos'
import OAuthDo from './providers/oauth-do'

export default {
  providers: [
    OAuthDo({
      clientId: process.env.OAUTH_DO_CLIENT_ID || '',
      clientSecret: process.env.OAUTH_DO_CLIENT_SECRET || '',
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    WorkOS({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.WORKOS_CLIENT_ID || '',
      clientSecret: process.env.WORKOS_CLIENT_SECRET || '',
    }),
  ],
} satisfies NextAuthConfig

// export const { auth, signIn, signOut } = NextAuth(authConfig)
