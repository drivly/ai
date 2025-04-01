import { createClient } from '@clickhouse/client-web'

export interface ClickhouseConfig {
  host: string
  port?: number
  username?: string
  password?: string
  database?: string
}

export class ClickhouseClient {
  private client

  constructor(config: ClickhouseConfig) {
    const hostWithPort = config.port ? 
      `${config.host}:${config.port}` : 
      config.host;
      
    this.client = createClient({
      host: hostWithPort,
      username: config.username || 'default',
      password: config.password || '',
      database: config.database || 'default',
    })
  }

  async query<T = any>(query: string, params?: Record<string, any>): Promise<T[]> {
    const result = await this.client.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    })
    const data = await result.json<T>()
    return data
  }

  async insert(table: string, data: Record<string, any> | Record<string, any>[]): Promise<void> {
    const rows = Array.isArray(data) ? data : [data]
    await this.client.insert({
      table,
      values: rows,
      format: 'JSONEachRow',
    })
  }

  async close(): Promise<void> {
    await this.client.close()
  }
}

export const createClickhouseClient = (config: ClickhouseConfig): ClickhouseClient => {
  return new ClickhouseClient(config)
}
