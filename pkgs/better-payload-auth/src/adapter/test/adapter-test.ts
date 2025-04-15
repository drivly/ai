// @ts-nocheck
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { afterAll, beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest'
import { payloadAdapter } from '../src/index'
import { runAdapterTest } from './better-auth-adapter-test'
import { getPayload } from '../dev/index.js'
import { BasePayload } from 'payload'

// Increase timeout for all tests, particularly important in CI environments
vi.setConfig({ testTimeout: 30000 })

// Helper function to wait between tests to avoid race conditions
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe.skip('Handle Payload Adapter', async () => {
  it('should successfully add the Payload Adapter', async () => {
    const payload = await getPayload()

    const auth = betterAuth({
      database: payloadAdapter(payload),
    })

    expect(auth).toBeDefined()
    expect(auth.options.database).toBeDefined()
    expect(auth.options.database({}).id).toEqual('payload')
  })
})

function deleteAll(payload: BasePayload) {
  beforeAll(async () => {
    // Wait for MongoDB connection to be fully established
    await wait(1000)

    // delete all users and sessions
    try {
      const res = await payload.delete({
        collection: 'user',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('before users: ', res.docs.length, res.errors)

      const res2 = await payload.delete({
        collection: 'session',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('before sessions: ', res2.docs.length, res2.errors)

      const res3 = await payload.delete({
        collection: 'account',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('before accounts: ', res3.docs.length, res3.errors)

      const res4 = await payload.delete({
        collection: 'verification',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('before verification: ', res4.docs.length, res4.errors)
    } catch (error) {
      console.error('Error in beforeAll cleanup:', error)
    }
  })

  afterAll(async () => {
    try {
      const res2 = await payload.delete({
        collection: 'session',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('after sessions: ', res2.docs.length, res2.errors)

      const res3 = await payload.delete({
        collection: 'account',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('after accounts: ', res3.docs.length, res3.errors)

      const res = await payload.delete({
        collection: 'user',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('after users: ', res.docs.length, res.errors)

      const res4 = await payload.delete({
        collection: 'verification',
        where: {
          id: {
            exists: true,
          },
        },
      })
      console.log('after verification: ', res4.docs.length, res4.errors)
    } catch (error) {
      console.error('Error in afterAll cleanup:', error)
    }
  })
}

describe.skip('Run BetterAuth Adapter tests', async () => {
  const payload = await getPayload()

  deleteAll(payload)

  const adapter = payloadAdapter(payload, {
    enableDebugLogs: true,
  })

  await runAdapterTest({
    getAdapter: async (
      customOptions = {
        session: {
          fields: {
            userId: 'user',
          },
        },
        account: {
          fields: {
            userId: 'user',
          },
        },
      },
    ) => {
      return adapter({ ...customOptions })
    },
    skipGenerateIdTest: true,
  })

  test('should find many with offset and limit', async () => {
    // At this point, `user` contains 8 rows.
    // offset of 2 returns 6 rows
    // limit of 2 returns 2 rows
    const res = await adapter({}).findMany({
      model: 'user',
      offset: 2,
      limit: 2,
    })
    expect(res.length).toBe(2)
  })
})

describe.skip('Authentication Flow Tests', async () => {
  const testUser = {
    email: 'test-email@email.com',
    password: 'password12345',
    name: 'Test Name',
  }
  const payload = await getPayload()

  deleteAll(payload)

  const auth = betterAuth({
    database: payloadAdapter(payload, {
      enableDebugLogs: true,
    }),
    emailAndPassword: {
      enabled: true,
    },
    session: {
      fields: {
        userId: 'user',
      },
    },
    account: {
      fields: {
        userId: 'user',
      },
    },
  })

  it('should successfully sign up a new user', async () => {
    const user = await auth.api.signUpEmail({
      body: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    })
    expect(user).toBeDefined()

    // Wait a moment to ensure the database operation completes
    await wait(1000)
  })

  it('should successfully sign in an existing user', async () => {
    // Increased wait time to ensure database operations are complete
    await wait(3000)

    const user = await auth.api.signInEmail({
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    })

    expect(user.user).toBeDefined()
  })
})
