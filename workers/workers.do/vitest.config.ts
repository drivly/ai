import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'miniflare3',
    environmentOptions: {
      bindings: {
        CF_ACCOUNT_ID: 'test-account-id',
        CF_API_TOKEN: 'test-api-token',
        CF_NAMESPACE_ID: 'test-namespace-id',
      },
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
