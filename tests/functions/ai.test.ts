import { describe } from 'vitest'
import { createTestSuite } from './common/testFactory'
import { libAiImplementation } from './implementations/libAi'
import { aiFunctionsImplementation } from './implementations/aiFunctions'
import { functionsdoImplementation } from './implementations/functionsdo'

/**
 * Unified test suite for AI functions
 */
describe('AI Functions', () => {
  describe('lib/ai', () => {
    createTestSuite(libAiImplementation)
  })

  describe('pkgs/ai-functions', () => {
    createTestSuite(aiFunctionsImplementation)
  })

  describe('sdks/functions.do', () => {
    createTestSuite(functionsdoImplementation)
  })
})
