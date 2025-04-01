export interface EventData {
  id?: string
  timestamp?: number | string
  type: string
  source: string
  subjectId?: string
  data?: Record<string, any>
  metadata?: Record<string, any>
  actionId?: string
  triggerId?: string
  searchId?: string
  functionId?: string
  workflowId?: string
  agentId?: string
}

export interface GenerationData {
  id?: string
  timestamp?: number | string
  actionId?: string
  settingsId?: string
  request?: Record<string, any>
  response?: Record<string, any>
  error?: Record<string, any>
  status: string
  duration: number
  tokensInput?: number
  tokensOutput?: number
  cost?: number
}

export interface RequestData {
  id?: string
  timestamp?: number | string
  method: string
  path: string
  hostname: string
  status: number
  latency: number
  userId?: string
  ip?: string
  userAgent?: string
  referer?: string
  requestBody?: Record<string, any>
  responseBody?: Record<string, any>
}

export interface BillingData {
  date: string
  cost: number
  tokens: number
}

export interface UsageData {
  functionId: string
  count: number
  totalTokens: number
  totalCost: number
}
