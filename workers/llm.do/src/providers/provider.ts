import { ai } from './ai'
import { openRouter } from './openRouter'

export interface Provider {
  fetchFromProvider: (init: { body?: Record<string, any>; headers?: { Authorization: string | undefined } }, method: string, path: string) => Promise<Response>
}

export const providers: Record<string, Provider> = {
  ai,
  openRouter,
  default: ai,
}
