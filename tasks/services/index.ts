import { TaskConfig } from 'payload'

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
  handler: async ({ payload, input }) => {
    try {
      const service = await payload.findByID({
        collection: 'services',
        id: input.id,
      })

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
              collection: 'services',
              id: input.id,
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
              collection: 'services',
              id: input.id,
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
      } catch (error) {
        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        if (service.status !== 'inactive') {
          await payload.update({
            collection: 'services',
            id: input.id,
            data: {
              status: 'inactive',
            },
          })
        }

        return {
          status: 'inactive',
          responseTime,
          message: error.message || 'Service is not responding',
        }
      }
    } catch (error) {
      console.error('Error checking service health:', error)
      return {
        status: 'error',
        message: error.message || 'Error checking service health',
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
  handler: async ({ payload, input }) => {
    try {
      const query = input.query || {}
      
      const services = await payload.find({
        collection: 'services',
        where: query,
      })
      
      return {
        services: services.docs,
      }
    } catch (error) {
      console.error('Error discovering services:', error)
      return {
        services: [],
      }
    }
  },
} as unknown as TaskConfig
