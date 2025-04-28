import type { AuthStrategy, AuthStrategyFunctionArgs, AuthStrategyFunction } from 'payload'
import { auth } from '@/auth'

export function authjsStrategy(): AuthStrategy {
  return {
    name: 'authjs',
    authenticate: (async ({ payload, headers }: AuthStrategyFunctionArgs) => {
      try {
        const session = await auth()

        if (!session || !session.user) {
          return { user: null }
        }

        return {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            collection: 'users',
            _strategy: 'authjs',
          },
        }
      } catch (error) {
        console.error('Authentication error:', error)
        return { user: null }
      }
    }) as AuthStrategyFunction,
  }
}
