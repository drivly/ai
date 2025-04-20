import { API } from '@/lib/api'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server.js'

export const GET = API(async (request, { params, url }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET

  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  const pathSegments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const workerName = pathSegments[0]

  if (!workerName) {
    return { error: 'Worker name is required', status: 400 }
  }

  const workerPath = pathSegments.slice(1).join('/')
  const workerUrl = new URL(`https://${workerName}.workers.do/${workerPath}`)
  workerUrl.search = url.search

  try {
    console.log(`Proxying GET request to: ${workerUrl.toString()}`)

    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: 'GET',
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
    })
    const endTime = Date.now()

    console.log(`Proxied GET response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })

    let responseData
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      responseData = await response.json()
    } else if (contentType.includes('text/')) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }

    return responseData
  } catch (error) {
    console.error(`Error proxying GET request to: ${workerUrl.toString()}`, error)

    return {
      error: 'Error proxying request',
      status: 500,
    }
  }
})

export const POST = API(async (request, { params, url }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET

  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  const pathSegments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const workerName = pathSegments[0]

  if (!workerName) {
    return { error: 'Worker name is required', status: 400 }
  }

  const workerPath = pathSegments.slice(1).join('/')
  const workerUrl = new URL(`https://${workerName}.workers.do/${workerPath}`)
  workerUrl.search = url.search

  try {
    console.log(`Proxying POST request to: ${workerUrl.toString()}`)

    const body = await request.text()

    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: 'POST',
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
      body,
    })
    const endTime = Date.now()

    console.log(`Proxied POST response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })

    let responseData
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      responseData = await response.json()
    } else if (contentType.includes('text/')) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }

    return responseData
  } catch (error) {
    console.error(`Error proxying POST request to: ${workerUrl.toString()}`, error)

    return {
      error: 'Error proxying request',
      status: 500,
    }
  }
})

export const PUT = API(async (request, { params, url }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET

  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  const pathSegments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const workerName = pathSegments[0]

  if (!workerName) {
    return { error: 'Worker name is required', status: 400 }
  }

  const workerPath = pathSegments.slice(1).join('/')
  const workerUrl = new URL(`https://${workerName}.workers.do/${workerPath}`)
  workerUrl.search = url.search

  try {
    console.log(`Proxying PUT request to: ${workerUrl.toString()}`)

    const body = await request.text()

    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: 'PUT',
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
      body,
    })
    const endTime = Date.now()

    console.log(`Proxied PUT response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return await response.json()
    } else if (contentType.includes('text/')) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }
  } catch (error) {
    console.error(`Error proxying PUT request to: ${workerUrl.toString()}`, error)

    return {
      error: 'Error proxying request',
      status: 500,
    }
  }
})

export const DELETE = API(async (request, { params, url }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET

  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  const pathSegments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const workerName = pathSegments[0]

  if (!workerName) {
    return { error: 'Worker name is required', status: 400 }
  }

  const workerPath = pathSegments.slice(1).join('/')
  const workerUrl = new URL(`https://${workerName}.workers.do/${workerPath}`)
  workerUrl.search = url.search

  try {
    console.log(`Proxying DELETE request to: ${workerUrl.toString()}`)

    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: 'DELETE',
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
    })
    const endTime = Date.now()

    console.log(`Proxied DELETE response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return await response.json()
    } else if (contentType.includes('text/')) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }
  } catch (error) {
    console.error(`Error proxying DELETE request to: ${workerUrl.toString()}`, error)

    return {
      error: 'Error proxying request',
      status: 500,
    }
  }
})

export const PATCH = API(async (request, { params, url }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET

  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  const pathSegments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : []
  const workerName = pathSegments[0]

  if (!workerName) {
    return { error: 'Worker name is required', status: 400 }
  }

  const workerPath = pathSegments.slice(1).join('/')
  const workerUrl = new URL(`https://${workerName}.workers.do/${workerPath}`)
  workerUrl.search = url.search

  try {
    console.log(`Proxying PATCH request to: ${workerUrl.toString()}`)

    const body = await request.text()

    const startTime = Date.now()
    const response = await fetch(workerUrl.toString(), {
      method: 'PATCH',
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Proxied-By': 'workers-api',
      },
      body,
    })
    const endTime = Date.now()

    console.log(`Proxied PATCH response from: ${workerUrl.toString()}`, {
      status: response.status,
      duration: endTime - startTime,
    })

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return await response.json()
    } else if (contentType.includes('text/')) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      })
    } else {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }
  } catch (error) {
    console.error(`Error proxying PATCH request to: ${workerUrl.toString()}`, error)

    return {
      error: 'Error proxying request',
      status: 500,
    }
  }
})
