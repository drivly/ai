import {
  ApiContext,
  ApiHandler,
  PayloadClientResult,
  PayloadClientFn,
  createAPI as createSimplePayloadAPI,
  modifyQueryString
} from 'simple-payload'

export type { ApiContext, PayloadClientResult, PayloadClientFn }

export const createAPI = createSimplePayloadAPI

// For backward compatibility
export const API = createAPI()

export { modifyQueryString }
