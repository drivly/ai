/**
 * Type definitions for actions.do SDK
 */

import { Action as ApiAction } from 'apis.do'

export type Action = ApiAction

export interface ActionConfig {
  name: string
  description?: string
  functionId?: string
  verbId?: string
  parameters?: Record<string, any>
}

export * from './src/constants.js'
