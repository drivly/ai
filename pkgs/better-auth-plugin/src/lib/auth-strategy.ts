import type { AuthStrategy } from 'payload'
import { getPayloadWithAuth } from '../index'
import type { TPlugins } from '../types'

/**
 * Auth strategy for BetterAuth
 * @param adminRoles - Admin roles
 * @param userSlug - User collection slug
 * @returns Auth strategy
 */
export function betterAuthStrategy(adminRoles?: string[], userSlug?: string): AuthStrategy {
  return {
    name: 'better-auth',
    authenticate: async ({ payload, headers }) => {
      try {
        const payloadAuth = await getPayloadWithAuth<NonNullable<TPlugins>>(payload.config)
        
        if (!payloadAuth) {
          console.error('payloadAuth is not available in auth-strategy')
          return { user: null }
        }
        
        if (!payloadAuth.betterAuth) {
          console.error('betterAuth is not available in auth-strategy')
          return { user: null }
        }
        
        if (!payloadAuth.betterAuth.api) {
          console.error('betterAuth API not available in auth-strategy')
          return { user: null }
        }
        
        const session = await payloadAuth.betterAuth.api.getSession({ headers })
        const sessionUserIdField = payloadAuth.betterAuth.options.session?.fields?.userId ?? 'userId'
        const userId = (session?.session as any)?.[sessionUserIdField] ?? session?.user?.id

        if (!session || !userId) {
          return { user: null }
        }
        
        try {
          const user = await payloadAuth.findByID({
            collection: userSlug ?? 'users',
            id: userId,
          })

          if (!user) {
            return { user: null }
          }

          return {
            user: {
              ...user,
              collection: userSlug ?? 'users',
              _strategy: 'better-auth',
            },
          }
        } catch (error) {
          console.error('Error finding user by ID:', error)
          return { user: null }
        }
      } catch (error) {
        console.error('Error in betterAuth authentication:', error)
        return { user: null }
      }
    },
  }
}
