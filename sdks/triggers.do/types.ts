/**
 * Type definitions for triggers.do SDK
 */

import { Trigger as ApiTrigger } from 'apis.do'

export type Trigger = ApiTrigger

export interface TriggerConfig {
  name: string
  payload?: Record<string, any>
  config?: Record<string, any>
}

export * from './src/constants.js'
