import { getPayload } from 'payload'
import config from './payload.config'
import { createAPI } from './pkgs/clickable-apis'

export const API = createAPI(getPayload({ config }))
