/**
 * Type definitions for actions.do SDK
 */

import type { Action as ApiAction } from 'apis.do/types'
import type { ClientOptions, ListResponse, QueryParams } from 'apis.do/types'
import type { ComposioActionTypes, ComposioActionName } from './generated/types'

export type Action = ApiAction

export interface ActionConfig {
  name: string
  description?: string
  functionId?: string
  verbId?: string
  parameters?: Record<string, any>
}

export interface ActionHandler {
  execute: (params?: Record<string, any>) => Promise<any>
}

export interface ActionClientOptions extends ClientOptions {
  baseUrl?: string
  apiKey?: string
}

export * from './src/constants'
export * from './generated/types'
