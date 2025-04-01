import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  try {
    const rawBody = await request.text()
    
    let emailData
    try {
      emailData = JSON.parse(rawBody)
    } catch (err) {
      console.error('Error parsing email data:', err)
      return new Response('Invalid email data format', { status: 400 })
    }
    
    const payloadInstance = await getPayload({ config })
    const results = await payloadInstance.create({ 
      collection: 'events', 
      data: { 
        data: emailData,
        type: 'email.received',
        source: 'email'
      } 
    })
    
    console.log('Email processed and stored:', results)
    return { success: true, results }
  } catch (err) {
    console.error('Email processing failed:', err)
    return new Response('Email processing failed', { status: 500 })
  }
})
