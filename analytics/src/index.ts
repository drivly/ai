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
      url = config.port ? 
        `${config.host}:${config.port}` : 
        config.host
    }
      
    this.client = createClient({
      url,
      username: config.username || 'default',
      password: config.password || '',
      database: config.database || 'default',
    })
  }

  async query<T = any>(query: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const result = await this.client.query({
        query,
        format: 'JSONEachRow',
        query_params: params,
      })
      const data = await result.json<T>()
      return data
    } catch (error: any) {
      if (error.message && (
          error.message.includes('Table') && 
          error.message.includes('doesn\'t exist') || 
          error.message.includes('no such table')
        )) {
        const tableMatch = query.match(/FROM\s+([^\s,();]+)/i)
        if (tableMatch && tableMatch[1]) {
          const tableName = tableMatch[1]
          await this.createTableAndRetry(tableName)
          return this.query<T>(query, params)
        }
      }
      throw error
    }
  }

  private async createTableAndRetry(table: string): Promise<void> {
    const schema = tableSchemas[table]
    if (!schema) {
      throw new Error(`No schema defined for table: ${table}`)
    }
    await this.createTable(table, schema)
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

  async tableExists(table: string): Promise<boolean> {
    console.warn('tableExists is deprecated. Tables are now created on-demand when needed.')
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

  async ensureTableExists(table: string): Promise<void> {
    console.warn('ensureTableExists is deprecated. Tables are now created on-demand when needed.')
    const schema = tableSchemas[table]
    if (!schema) {
      throw new Error(`No schema defined for table: ${table}`)
    }
    await this.createTable(table, schema)
  }

  async insert(table: string, data: Record<string, any> | Record<string, any>[]): Promise<void> {
    const rows = Array.isArray(data) ? data : [data]
    try {
      await this.client.insert({
        table,
        values: rows,
        format: 'JSONEachRow',
      })
    } catch (error: any) {
      if (error.message && (
          error.message.includes('Table') && 
          error.message.includes('doesn\'t exist') || 
          error.message.includes('no such table')
        )) {
        await this.createTableAndRetry(table)
        await this.client.insert({
          table,
          values: rows,
          format: 'JSONEachRow',
        })
      } else {
        throw error
      }
    }
  }

  async close(): Promise<void> {
    await this.client.close()
  }
}

export const createClickhouseClient = (config: ClickhouseConfig): ClickhouseClient => {
  return new ClickhouseClient(config)
}
