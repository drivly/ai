export * from './types'
export * from './api'

export { createPayloadClient } from './createPayloadClient'
export { createRestPayloadClient } from './createRestPayloadClient'

export { createNodePayloadClient } from './adapters/node'
export { createEdgePayloadClient } from './adapters/edge'

export { createNodePayloadClient as createDefaultPayloadClient } from './adapters/node'

export { REST_GET, REST_POST, REST_PUT, REST_PATCH, REST_DELETE, REST_OPTIONS } from './routes'
export { ADMIN_GET } from './admin'

export { createPayloadConfig } from './config'
