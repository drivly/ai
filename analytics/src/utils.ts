import { ClickhouseClient } from './index'
import { EventData, GenerationData, RequestData, BillingData, UsageData } from './types'

export class AnalyticsService {
  private client: ClickhouseClient

  constructor(client: ClickhouseClient) {
    this.client = client
  }

  async trackEvent(event: EventData): Promise<void> {
    if (!event.timestamp) {
      event.timestamp = Date.now()
    }
    await this.client.ensureTableExists('events')
    await this.client.insert('events', event)
  }

  async trackGeneration(generation: GenerationData): Promise<void> {
    if (!generation.timestamp) {
      generation.timestamp = Date.now()
    }
    await this.client.ensureTableExists('generations')
    await this.client.insert('generations', generation)
  }

  async trackRequest(request: RequestData): Promise<void> {
    try {
      if (!request.timestamp) {
        request.timestamp = Date.now()
      }
      await this.client.ensureTableExists('requests')
      await this.client.insert('requests', request)
    } catch (error) {
      console.error('Failed to track request:', error)
    }
  }

  async getEvents(options: {
    startDate?: Date
    endDate?: Date
    type?: string
    source?: string
    limit?: number
  } = {}): Promise<EventData[]> {
    await this.client.ensureTableExists('events')
    
    const { startDate, endDate, type, source, limit } = options
    
    let query = 'SELECT * FROM events WHERE 1=1'
    const params: Record<string, any> = {}
    
    if (startDate) {
      query += ' AND timestamp >= {startDate:Int32}'
      params.startDate = Math.floor(startDate.getTime() / 1000)
    }
    
    if (endDate) {
      query += ' AND timestamp <= {endDate:Int32}'
      params.endDate = Math.floor(endDate.getTime() / 1000)
    }
    
    if (type) {
      query += ' AND type = {type:String}'
      params.type = type
    }
    
    if (source) {
      query += ' AND source = {source:String}'
      params.source = source
    }
    
    query += ' ORDER BY timestamp DESC'
    
    if (limit) {
      query += ` LIMIT ${limit}`
    }
    
    return this.client.query<EventData>(query, params)
  }

  async getGenerations(options: {
    startDate?: Date
    endDate?: Date
    status?: string
    limit?: number
  } = {}): Promise<GenerationData[]> {
    await this.client.ensureTableExists('generations')
    
    const { startDate, endDate, status, limit } = options
    
    let query = 'SELECT * FROM generations WHERE 1=1'
    const params: Record<string, any> = {}
    
    if (startDate) {
      query += ' AND timestamp >= {startDate:Int32}'
      params.startDate = Math.floor(startDate.getTime() / 1000)
    }
    
    if (endDate) {
      query += ' AND timestamp <= {endDate:Int32}'
      params.endDate = Math.floor(endDate.getTime() / 1000)
    }
    
    if (status) {
      query += ' AND status = {status:String}'
      params.status = status
    }
    
    query += ' ORDER BY timestamp DESC'
    
    if (limit) {
      query += ` LIMIT ${limit}`
    }
    
    return this.client.query<GenerationData>(query, params)
  }

  async getRequests(options: {
    startDate?: Date
    endDate?: Date
    path?: string
    method?: string
    limit?: number
  } = {}): Promise<RequestData[]> {
    await this.client.ensureTableExists('requests')
    
    const { startDate, endDate, path, method, limit } = options
    
    let query = 'SELECT * FROM requests WHERE 1=1'
    const params: Record<string, any> = {}
    
    if (startDate) {
      query += ' AND timestamp >= {startDate:Int32}'
      params.startDate = Math.floor(startDate.getTime() / 1000)
    }
    
    if (endDate) {
      query += ' AND timestamp <= {endDate:Int32}'
      params.endDate = Math.floor(endDate.getTime() / 1000)
    }
    
    if (path) {
      query += ' AND path = {path:String}'
      params.path = path
    }
    
    if (method) {
      query += ' AND method = {method:String}'
      params.method = method
    }
    
    query += ' ORDER BY timestamp DESC'
    
    if (limit) {
      query += ` LIMIT ${limit}`
    }
    
    return this.client.query<RequestData>(query, params)
  }
  
  async getBillingData(options: {
    startDate?: Date
    endDate?: Date
    groupBy?: 'day' | 'week' | 'month'
  } = {}): Promise<BillingData[]> {
    await this.client.ensureTableExists('generations')
    
    const { startDate, endDate, groupBy = 'day' } = options
    
    let timeFormat
    switch (groupBy) {
      case 'day':
        timeFormat = '%Y-%m-%d'
        break
      case 'week':
        timeFormat = '%Y-%U'
        break
      case 'month':
        timeFormat = '%Y-%m'
        break
    }
    
    let query = `
      SELECT 
        formatDateTime(timestamp, '${timeFormat}') as date,
        sum(cost) as cost,
        sum(tokensInput + tokensOutput) as tokens
      FROM generations 
      WHERE 1=1
    `
    
    const params: Record<string, any> = {}
    
    if (startDate) {
      query += ' AND timestamp >= {startDate:Int32}'
      params.startDate = Math.floor(startDate.getTime() / 1000)
    }
    
    if (endDate) {
      query += ' AND timestamp <= {endDate:Int32}'
      params.endDate = Math.floor(endDate.getTime() / 1000)
    }
    
    query += ' GROUP BY date ORDER BY date'
    
    return this.client.query<BillingData>(query, params)
  }

  async getTopUsage(options: {
    startDate?: Date
    endDate?: Date
    limit?: number
  } = {}): Promise<UsageData[]> {
    await this.client.ensureTableExists('generations')
    
    const { startDate, endDate, limit = 10 } = options
    
    let query = `
      SELECT 
        functionId,
        count() as count,
        sum(tokensInput + tokensOutput) as totalTokens,
        sum(cost) as totalCost
      FROM generations 
      WHERE functionId IS NOT NULL
    `
    
    const params: Record<string, any> = {}
    
    if (startDate) {
      query += ' AND timestamp >= {startDate:Int32}'
      params.startDate = Math.floor(startDate.getTime() / 1000)
    }
    
    if (endDate) {
      query += ' AND timestamp <= {endDate:Int32}'
      params.endDate = Math.floor(endDate.getTime() / 1000)
    }
    
    query += ` GROUP BY functionId ORDER BY count DESC LIMIT ${limit}`
    
    return this.client.query<UsageData>(query, params)
  }
}

export const createAnalyticsService = (client: ClickhouseClient): AnalyticsService => {
  return new AnalyticsService(client)
}
