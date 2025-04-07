/**
 * Type definitions for triggers.do SDK
 */

import type { Trigger as ApiTrigger } from 'apis.do/types'

export type Trigger = ApiTrigger

export interface TriggerConfig {
  name: string
  payload?: Record<string, any>
  config?: Record<string, any>
}

export * from './src/constants.js'
