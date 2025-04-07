import { Express, RequestHandler } from 'express'
import type { Config } from 'payload/config'

interface Endpoint {
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  handler: RequestHandler
}

export interface Auth {
  endpoints?: Endpoint[]
  preInit?: (args: { express: Express }) => void
  postInit?: (args: { express: Express; config: Config }) => void
}
