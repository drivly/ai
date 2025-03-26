export interface PayloadAgentUser {
  id: string
  collection: string
  email?: string
  [key: string]: any
}

// Use any for permissions to avoid complex type mapping
export type PayloadAgentPermissions = Record<string, any>

export interface PayloadAgentAuthResult {
  user: PayloadAgentUser | null
  permissions: PayloadAgentPermissions
  responseHeaders?: Headers
}
