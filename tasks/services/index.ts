import { TaskConfig, Payload } from 'payload'
import { Service } from '../../sdks/services.do/types'

interface TaskHandlerParams {
  payload: Payload;
  input: {
    id?: string;
    timeout?: number;
    query?: Record<string, any>;
  };
}

export const checkServiceHealthTask = {
  slug: 'checkServiceHealth',
  label: 'Check Service Health',
  inputSchema: [
    { name: 'id', type: 'text', required: true },
    { name: 'timeout', type: 'number', defaultValue: 5000 },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'responseTime', type: 'number' },
    { name: 'message', type: 'text' },
  ],
  handler: async ({ payload, input }: TaskHandlerParams) => {
    try {
      const service = await payload.findByID({
        collection: 'services' as any,
        id: input.id as string,
      }) as Service | null

      if (!service) {
        return {
          status: 'error',
          message: 'Service not found',
        }
      }

      const startTime = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), input.timeout || 5000)

      try {
        const response = await fetch(service.endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        if (response.ok) {
          if (service.status !== 'active') {
            await payload.update({
              collection: 'services' as any,
              id: input.id as string,
              data: {
                status: 'active',
              },
            })
          }

          return {
            status: 'active',
            responseTime,
            message: 'Service is healthy',
          }
        } else {
          if (service.status !== 'degraded') {
            await payload.update({
              collection: 'services' as any,
              id: input.id as string,
              data: {
                status: 'degraded',
              },
            })
          }

          return {
            status: 'degraded',
            responseTime,
            message: `Service responded with status ${response.status}`,
          }
        }
      } catch (error: unknown) {
        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        if (service.status !== 'inactive') {
          await payload.update({
            collection: 'services' as any,
            id: input.id as string,
            data: {
              status: 'inactive',
            },
          })
        }

        const errorMessage = error instanceof Error ? error.message : 'Service is not responding'
        
        return {
          status: 'inactive',
          responseTime,
          message: errorMessage,
        }
      }
    } catch (error: unknown) {
      console.error('Error checking service health:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error checking service health'
      
      return {
        status: 'error',
        message: errorMessage,
      }
    }
  },
} as unknown as TaskConfig

export const discoverServicesTask = {
  slug: 'discoverServices',
  label: 'Discover Services',
  inputSchema: [
    { name: 'query', type: 'json' },
  ],
  outputSchema: [
    { name: 'services', type: 'json' },
  ],
  handler: async ({ payload, input }: TaskHandlerParams) => {
    try {
      const query = input.query || {}
      
      const services = await payload.find({
        collection: 'services' as any,
        where: query,
      })
      
      return {
        services: services.docs,
      }
    } catch (error: unknown) {
      console.error('Error discovering services:', error)
      return {
        services: [],
      }
    }
  },
} as unknown as TaskConfig
