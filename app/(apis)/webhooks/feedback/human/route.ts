import config from '@/payload.config'
import { processHumanFeedbackResponse } from '@/tasks/ai/requestHumanFeedback'
import { NextRequest, NextResponse } from 'next/server.js'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const { taskId, option, text, platform = 'slack' } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Missing taskId' }, { status: 400 })
    }

    await processHumanFeedbackResponse(
      {
        taskId,
        option,
        text,
        platform,
      },
      payload,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing human feedback:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
