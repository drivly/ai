import { getPayload } from 'payload'
import config from '../payload.config'

async function addLinearIntegration() {
  try {
    const payload = await getPayload({
      config,
    })

    const existingIntegrations = await payload.find({
      collection: 'integrations',
      where: {
        id: {
          equals: 'linear',
        },
      },
    })

    if (existingIntegrations.docs.length > 0) {
      console.log('Linear integration already exists, skipping creation')
      process.exit(0)
    }

    const linearIntegration = await payload.create({
      collection: 'integrations',
      data: {
        id: 'linear',
        name: 'Linear',
        provider: 'linear',
      },
    })

    console.log('Linear integration created successfully:', linearIntegration)
  } catch (error) {
    console.error('Error creating Linear integration:', error)
  }
}

addLinearIntegration()
