import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server.js'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const errorData = await request.json()

    const result = await payload.create({
      collection: 'errors',
      data: {
        message: errorData.message,
        stack: errorData.stack,
        digest: errorData.digest,
        url: errorData.url,
        source: errorData.source || 'global-error-handler',
      },
    })

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (error) {
    console.error('Failed to record error:', error)
    return NextResponse.json({ success: false, error: 'Failed to record error' }, { status: 500 })
  }
}
