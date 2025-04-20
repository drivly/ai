import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { authConfig } from "./auth.config"
import { getOAuthCallbackURL } from "@/lib/utils/url"
import { DefaultSession, JWT, User, Session } from "next-auth"
import { AdapterUser } from "next-auth/adapters"

let MongoDBAdapter: any = null
let clientPromise: any = null

if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
  const loadAdapterAndClient = async () => {
    try {
      const adapterModule = await import('@auth/mongodb-adapter')
      const mongoModule = await import('@/lib/mongodb')
      
      MongoDBAdapter = adapterModule.MongoDBAdapter
      clientPromise = mongoModule.default
    } catch (e) {
      console.error('Failed to import MongoDB adapter or client:', e)
    }
  }
  
  loadAdapterAndClient()
}

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
    id?: string
    role?: string
  }
}

const authOptions = {
  ...authConfig,
  ...(MongoDBAdapter && clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
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
    // {
    //   id: 'google',
    //   name: 'Google',
    //   type: 'oauth',
    //   wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //   authorization: {
    //     params: {
    //       redirect_uri: getOAuthCallbackURL('google')
    //     }
    //   },
    //   checks: ['pkce', 'state'],
    //   token: {
    //     idToken: true
    //   },
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //       role: 'user',
    //     }
    //   },
    // },
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
      profile(profile: { sub: string; name: string; email: string; picture: string }) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
        }
      },
    },
    // {
    //   id: 'linear',
    //   name: 'Linear',
    //   type: 'oauth',
    //   authorization: {
    //     url: 'https://linear.app/oauth/authorize',
    //     params: {
    //       redirect_uri: getOAuthCallbackURL('linear'),
    //       scope: 'read write',
    //     }
    //   },
    //   token: {
    //     url: 'https://api.linear.app/oauth/token',
    //   },
    //   clientId: process.env.LINEAR_CLIENT_ID as string,
    //   clientSecret: process.env.LINEAR_CLIENT_SECRET as string,
    //   profile(profile) {
    //     return {
    //       id: profile.id,
    //       name: profile.name || profile.displayName,
    //       email: profile.email,
    //       image: profile.avatarUrl,
    //       role: 'user',
    //     }
    //   },
    // },
  ],
  callbacks: {
    async jwt(params: { token: JWT; user?: User }) {
      if (params.user) {
        params.token.id = params.user.id
        params.token.role = params.user.role || 'user'
      }
      return params.token
    },
    async session(params: { session: Session; token: JWT }) {
      if (params.session.user) {
        params.session.user.id = params.token.id as string
        params.session.user.role = params.token.role as string
      }
      return params.session
    }
  },
  session: { strategy: "jwt" }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)
