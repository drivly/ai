import { describe } from 'vitest'
import { createTestSuite } from './common/testFactory'
import { functionsdoImplementation } from './implementations/functionsdo'

/**
 * Unified test suite for AI functions
 */
describe('AI Functions', () => {
  describe('sdks/functions.do', () => {
    createTestSuite(functionsdoImplementation)
  })
})
