import { vi } from 'vitest'

global.fetch = vi.fn()

process.env.CF_ACCOUNT_ID = 'test-account-id'
process.env.CF_API_TOKEN = 'test-token'
process.env.CF_NAMESPACE_ID = 'test-namespace-id'

process.env.OPENAI_API_KEY = 'sk-test'
process.env.ANTHROPIC_API_KEY = 'test-key'
