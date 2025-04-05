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
  private databaseName: string
  private url: string | undefined
  private username: string
  private password: string

  constructor(config: ClickhouseConfig) {
    let url = config.url

    if (!url && config.host) {
      url = config.port ? `${config.host}:${config.port}` : config.host
    }

    this.databaseName = config.database || 'default'
    this.url = url
    this.username = config.username || 'default'
    this.password = config.password || ''

    this.client = createClient({
      url,
      username: this.username,
      password: this.password,
      database: this.databaseName,
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
      if (error.type === 'UNKNOWN_DATABASE' || (error.message && error.message.includes('Database') && error.message.includes('does not exist'))) {
        await this.createDatabase()
        return this.query<T>(query, params)
      }

      if (
        error.type === 'UNKNOWN_TABLE' ||
        error.code === '60' ||
        (error.message &&
          error.message.includes('Table') &&
          (error.message.includes("doesn't exist") || error.message.includes('does not exist') || error.message.includes('no such table')))
      ) {
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
    const tableName = table.includes('.') ? table.split('.').pop() || table : table

    const schema = tableSchemas[tableName]
    if (!schema) {
      throw new Error(`No schema defined for table: ${tableName}`)
    }
    await this.createTable(tableName, schema)
  }

  async createDatabase(): Promise<void> {
    try {
      const tempClient = createClient({
        url: this.url,
        username: this.username,
        password: this.password,
      })

      await tempClient.query({
        query: `CREATE DATABASE IF NOT EXISTS ${this.databaseName}`,
      })

      console.log(`Created database: ${this.databaseName}`)

      await tempClient.close()
    } catch (error: any) {
      console.error(`Error creating database:`, error)
      throw new Error(`Failed to create database: ${error.message || String(error)}`)
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
      if (error.type === 'UNKNOWN_DATABASE' || (error.message && error.message.includes('Database') && error.message.includes('does not exist'))) {
        await this.createDatabase()
        return this.insert(table, data)
      }

      if (
        error.type === 'UNKNOWN_TABLE' ||
        error.code === '60' ||
        (error.message &&
          error.message.includes('Table') &&
          (error.message.includes("doesn't exist") || error.message.includes('does not exist') || error.message.includes('no such table')))
      ) {
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
