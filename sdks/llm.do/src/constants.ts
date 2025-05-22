export const ERROR_TYPES = ['MODEL_NOT_FOUND', 'MODEL_INCOMPATIBLE', 'TOOL_AUTHORIZATION', 'UNSUPPORTED_AUTH_SCHEME', 'UNKNOWN_AUTH_SCHEME'] as const

export const messageResponseRoles = ['user', 'assistant', 'system'] as const

export const outputFormats = ['JSON', 'Markdown', 'Code', 'Python', 'TypeScript', 'JavaScript'] as const

export const providerPriorities = ['cost', 'throughput', 'latency'] as const

export const toolAuthorizationModes = ['OAUTH2', 'OAUTH1', 'OAUTH1A', 'API_KEY', 'BASIC', 'BEARER_TOKEN', 'GOOGLE_SERVICE_ACCOUNT', 'NO_AUTH', 'BASIC_WITH_JWT'] as const
