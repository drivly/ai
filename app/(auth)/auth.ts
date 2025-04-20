import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import WorkOS from "next-auth/providers/workos"
import { authConfig } from "./auth.config"
import { getOAuthCallbackURL } from "@/lib/utils/url"
import { DefaultSession, JWT, User, Session } from "next-auth"

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

const authOptions: any = {
  ...authConfig,
  ...(MongoDBAdapter && clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    WorkOS({
      clientId: process.env.WORKOS_CLIENT_ID || "",
      clientSecret: process.env.WORKOS_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    jwt(params: { token: JWT; user?: User }) {
      if (params.user) {
        params.token.id = params.user.id
        params.token.role = params.user.role || 'user'
      }
      return params.token
    },
    session(params: { session: Session; token: JWT }) {
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
