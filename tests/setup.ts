// Test setup file
import '@testing-library/jest-dom'

// Note: We don't set NODE_ENV directly as it's read-only in some environments
process.env.IS_TEST_ENV = 'true'

// Global test setup
beforeAll(() => {
  console.log('Starting tests with IS_TEST_ENV =', process.env.IS_TEST_ENV)
})

// Global test teardown
afterAll(() => {
  console.log('All tests completed')
})