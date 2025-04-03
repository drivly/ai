import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request) {
  const headersList = headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET
  
  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const url = new URL(request.url)
  const origin = url.origin
  const searchParams = url.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  const baseUrl = `${origin}/workers`
  const links = {
    home: baseUrl,
  }
  
  const workers = {
    'example-worker': `${origin}/workers/example-worker`,
  }
  
  const apiHeader = {
    name: 'workers.do',
    description: 'Cloudflare Workers API',
    home: origin,
    login: `${origin}/login`,
    signup: `${origin}/signup`,
    admin: `${origin}/admin`,
    docs: `${origin}/docs`,
    repo: 'https://github.com/drivly/ai',
    sdk: 'https://npmjs.com/workers.do',
    site: 'https://workers.do',
  }
  
  const user = {
    authenticated: false,
    plan: 'Free',
    ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
    isp: 'Unknown ISP',
    flag: '🏳️',
    requestId: Date.now().toString(),
    localTime: new Date().toLocaleString(),
    timezone: 'UTC',
    latencyMilliseconds: 0,
    recentInteractions: 0,
  }
  
  return NextResponse.json({
    api: apiHeader,
    workers,
    links,
    page,
    limit,
    total: Object.keys(workers).length,
    user,
  })
}

export async function POST(request) {
  return await handleWorkerRequest(request)
}

export async function PUT(request) {
  return await handleWorkerRequest(request)
}

export async function DELETE(request) {
  return await handleWorkerRequest(request)
}

export async function PATCH(request) {
  return await handleWorkerRequest(request)
}

export async function handleWorkerRequest(request) {
  const headersList = headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET
  
  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const url = new URL(request.url)
  const workerName = url.pathname.split('/workers/')[1]?.split('/')[0]
  
  if (!workerName) {
    return NextResponse.json({ error: 'Worker name is required' }, { status: 400 })
  }
  
  const workerUrl = new URL(`https://${workerName}.workers.do${url.pathname.replace(`/workers/${workerName}`, '')}`)
  workerUrl.search = url.search
  
  try {
    console.log(`Proxying request to: ${workerUrl.toString()}`)
    
    let body = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer()
    }
    
    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
      body: body,
    })
    const endTime = Date.now()
    
    console.log(`Proxied response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })
    
    const responseData = await response.arrayBuffer()
    
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error(`Error proxying request to: ${workerUrl.toString()}`, error)
    
    return NextResponse.json(
      { error: 'Error proxying request', message: error.message },
      { status: 500 }
    )
  }
}
