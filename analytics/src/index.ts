import { createClient } from '@clickhouse/client-web'
import { tableSchemas } from './schema'

export interface ClickhouseConfig {
  url?: string
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
}

export class ClickhouseClient {
  private client

  constructor(config: ClickhouseConfig) {
    let url = config.url

    if (!url && config.host) {
      url = config.port ? `${config.host}:${config.port}` : config.host
    }
    this.client = createClient({
      url,
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

  async tableExists(table: string): Promise<boolean> {
    try {
      const result = await this.client.query({
        query: `EXISTS TABLE ${table}`,
        format: 'JSONEachRow',
      })
      const data = await result.json<{ exists: number }>()
      return data[0]?.exists === 1
    } catch (error) {
      console.error(`Error checking if table ${table} exists:`, error)
      return false
    }
  }

  async createTable(tableName: string, schema: string): Promise<void> {
    try {
      await this.client.query({
        query: schema,
      })
    } catch (error: any) {
      console.error(`Error creating table ${tableName}:`, error)
      throw new Error(`Failed to create table ${tableName}: ${error.message || String(error)}`)
    }
  }

  async ensureTableExists(table: string): Promise<void> {
    try {
      const exists = await this.tableExists(table)
      if (!exists) {
        const schema = tableSchemas[table]
        if (!schema) {
          throw new Error(`No schema defined for table: ${table}`)
        }
        await this.createTable(table, schema)
      }
    } catch (error: any) {
      throw new Error(`Failed to ensure table ${table} exists: ${error.message || String(error)}`)
    }
  }

  async insert(table: string, data: Record<string, any> | Record<string, any>[]): Promise<void> {
    await this.ensureTableExists(table)
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
