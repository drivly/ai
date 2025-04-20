import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { authConfig } from "./auth.config"
import { getOAuthCallbackURL } from "@/lib/utils/url"
import { DefaultSession, JWT } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
  }
  
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth" {
  interface JWT {
    id: string
    role: string
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: getOAuthCallbackURL('github')
        }
      }
    }),
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: getOAuthCallbackURL('google')
        }
      },
      checks: ['pkce', 'state'],
      token: {
        idToken: true
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
        }
      },
    },
    {
      id: 'workos',
      name: 'WorkOS',
      type: 'oauth',
      authorization: {
        url: 'https://api.workos.com/sso/authorize',
        params: {
          redirect_uri: getOAuthCallbackURL('workos'),
          scope: 'openid profile email',
        }
      },
      token: {
        url: 'https://api.workos.com/sso/token',
      },
      clientId: process.env.WORKOS_CLIENT_ID as string,
      clientSecret: process.env.WORKOS_CLIENT_SECRET as string,
      userinfo: {
        url: 'https://api.workos.com/sso/userinfo',
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
        }
      },
    },
    {
      id: 'linear',
      name: 'Linear',
      type: 'oauth',
      authorization: {
        url: 'https://linear.app/oauth/authorize',
        params: {
          redirect_uri: getOAuthCallbackURL('linear'),
          scope: 'read write',
        }
      },
      token: {
        url: 'https://api.linear.app/oauth/token',
      },
      clientId: process.env.LINEAR_CLIENT_ID as string,
      clientSecret: process.env.LINEAR_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.displayName,
          email: profile.email,
          image: profile.avatarUrl,
          role: 'user',
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: { strategy: "jwt" }
})
