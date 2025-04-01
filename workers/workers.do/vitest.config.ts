import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'workers',
    poolOptions: {
      workers: {
        miniflare: {
          bindings: {
            CF_ACCOUNT_ID: 'test-account-id',
            CF_API_TOKEN: 'test-api-token',
            CF_NAMESPACE_ID: 'test-namespace-id',
          },
        },
      },
    },
  },
})
