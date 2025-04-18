import { ApiClient } from './api'
import { Agent as CloudflareAgent, AgentNamespace } from 'agents'
import type { AgentConfig, AgentResponse, AgentClientOptions, AgentExecutionOptions, AgentExecutionResult, AgentDoFunction, AgentDoTemplateFunction } from '../types'
import { serializeValue } from './utils'

export * from '../types'

export type { AgentNamespace } from 'agents'

/**
 * Creates a template string from template literals
 */
function processTemplateLiteral(strings: TemplateStringsArray, ...values: any[]): string {
  let result = strings[0]
  for (let i = 0; i < values.length; i++) {
    const serializedValue = serializeValue(values[i])
    result += serializedValue + strings[i + 1]
  }
  return result
}

export class Agent<Env = any, State = any> extends CloudflareAgent<Env, State> {
  constructor(config: any, state: any = {}) {
    super(config, state)
  }

  async execute(input: Record<string, any>, options?: AgentExecutionOptions): Promise<any> {
    return { data: 'executed', input, options }
  }

  do = new Proxy(function doMethod() {}, {
    apply: async (target: any, thisArg: any, args: any[]) => {
      if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
        const template = args[0] as TemplateStringsArray
        const expressions = args.slice(1)
        const prompt = processTemplateLiteral(template, ...expressions)
        return thisArg.execute({ prompt })
      } else {
        const input = typeof args[0] === 'string' || typeof args[0] === 'object' ? args[0] : ''
        const options = args[1]
        return thisArg.execute({ prompt: input }, options)
      }
    },
  }) as AgentDoTemplateFunction
}

export function openai(model: string) {
  return `openai/${model}`
}

export function anthropic(model: string) {
  return `anthropic/${model}`
}

export class AgentsClient {
  private api: ApiClient
  private defaultConfig?: Partial<AgentConfig>

  constructor(options: AgentClientOptions = {}) {
    this.api = new ApiClient({
      baseUrl: options.baseUrl || 'https://agents.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
    this.defaultConfig = options.defaultConfig
  }

  async ask<T = any>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>> {
    return this.api.post(`/v1/agents/${agentId}/ask`, {
      question,
      context,
    })
  }

  async execute<T = any>(agentId: string, input: Record<string, any>, options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
    return this.api.post(`/v1/agents/${agentId}/execute`, {
      input,
      options,
    })
  }

  async create(agentConfig: AgentConfig): Promise<any> {
    const config = {
      ...this.defaultConfig,
      ...agentConfig,
    }
    return this.api.post('/v1/agents', config)
  }

  async list(params?: { limit?: number; page?: number }): Promise<any> {
    return this.api.list('agents', params)
  }

  async get(agentId: string): Promise<any> {
    return this.api.getById('agents', agentId)
  }

  async update(agentId: string, data: Partial<AgentConfig>): Promise<any> {
    return this.api.update('agents', agentId, data)
  }

  async delete(agentId: string): Promise<any> {
    return this.api.remove('agents', agentId)
  }
}

/**
 * Standalone do function for executing agent tasks
 * Supports both normal function calls and template literals
 */
export const doFunction = new Proxy(function doFunction() {}, {
  apply: async (target: any, thisArg: any, args: any[]) => {
    const client = new AgentsClient()
    let agentId: string
    let input: string | Record<string, any>
    let options: AgentExecutionOptions | undefined

    if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
      const template = args[0] as TemplateStringsArray
      const expressions = args.slice(1)
      const prompt = processTemplateLiteral(template, ...expressions)

      if (thisArg && thisArg.agentId) {
        agentId = thisArg.agentId
        input = prompt
      } else {
        throw new Error('Agent ID must be specified when using template literals without a prior agent selection')
      }
    } else if (args.length === 1 && typeof args[0] === 'string') {
      const selectedAgentId = args[0]

      return new Proxy(function () {}, {
        apply: async (innerTarget: any, innerThisArg: any, innerArgs: any[]) => {
          if (innerArgs[0] && Array.isArray(innerArgs[0]) && 'raw' in innerArgs[0]) {
            const template = innerArgs[0] as TemplateStringsArray
            const expressions = innerArgs.slice(1)
            input = processTemplateLiteral(template, ...expressions)
          } else {
            input = innerArgs[0]
            options = innerArgs[1]
          }

          return client.execute(selectedAgentId, { prompt: input }, options)
        },
      })
    } else {
      input = args[0]
      options = args[1]

      if (thisArg && thisArg.agentId) {
        agentId = thisArg.agentId
      } else {
        throw new Error('Agent ID must be specified when calling the do function directly')
      }
    }

    return client.execute(agentId, { prompt: input }, options)
  },
}) as AgentDoFunction

export default AgentsClient
