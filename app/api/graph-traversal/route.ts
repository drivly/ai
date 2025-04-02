import { NextRequest, NextResponse } from 'next/server'
import { traverseGraph } from '../../../lib/mongoose-graph-traversal'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const resourceId = url.searchParams.get('resourceId')
  const maxDepth = parseInt(url.searchParams.get('maxDepth') || '3')

  if (!resourceId) {
    return NextResponse.json({ error: 'resourceId is required' }, { status: 400 })
  }

  try {
    const result = await traverseGraph({
      startId: resourceId,
      maxDepth,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in graph traversal:', error)
    return NextResponse.json({ error: 'Failed to traverse graph' }, { status: 500 })
  }
}
