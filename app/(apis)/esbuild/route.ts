import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server.js'

/**
 * ESBuild API route
 *
 * Processes code from functions, URLs, or request body to create modules and packages
 * Mirrors the API format of esb.denoflare.dev but removes https:// from the base path
 */

const DEFAULT_OPTIONS = {
  type: 'bundle',
  format: 'esm',
  target: 'esnext',
  legalcomments: 'inline',
  sourcemap: false,
  minify: false,
  treeshaking: true,
}

function parseOptions(optionsString: string): Record<string, string | boolean> {
  if (!optionsString) return {}

  const options: Record<string, string | boolean> = {}

  optionsString.split(',').forEach((option) => {
    const [name, value] = option.split('=')
    if (!name) return

    if (!value) {
      options[name] = true
      return
    }

    options[name] = value
  })

  return options
}

function convertToESBuildOptions(options: Record<string, any>) {
  const esbuildOptions = {
    bundle: options.type === 'transform' ? false : true,
    format: options.format || DEFAULT_OPTIONS.format,
    target: options.target || DEFAULT_OPTIONS.target,
    legalComments: options.legalcomments || DEFAULT_OPTIONS.legalcomments,
    sourcemap: options.sourcemap ? 'inline' : false,
    minify: options.minify === true,
    treeShaking: options.treeshaking !== false,
  }

  return { config: esbuildOptions }
}

async function fetchCodeFromUrl(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch code from URL: ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Error fetching code: ${errorMessage}`)
  }
}

/**
 * Process code from URL or functions
 * Format: /[options]/[url]
 * Example: /target=es2015,minify/example.com/code.js
 */
export const GET = API(async (req, ctx) => {
  const { pathname } = new URL(req.url)
  const pathSegments = pathname.replace(/^\/esbuild\//, '').split('/')

  if (pathSegments.length === 0 || (pathSegments.length === 1 && !pathSegments[0])) {
    return processFunctions()
  }

  let optionsString = ''
  let urlIndex = 0

  if (pathSegments[0] && !pathSegments[0].includes('://')) {
    optionsString = pathSegments[0]
    urlIndex = 1
  }

  const urlPath = pathSegments.slice(urlIndex).join('/')

  if (!urlPath) {
    return {
      error: 'URL is required',
      success: false,
    }
  }

  const options = parseOptions(optionsString)
  const esbuildOptions = convertToESBuildOptions(options)

  try {
    const code = await fetchCodeFromUrl(urlPath.startsWith('http') ? urlPath : `https://${urlPath}`)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/esbuild`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        options: esbuildOptions,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      return {
        error: result.error || 'Failed to process code',
        success: false,
      }
    }

    const processedCode = result.code

    return new NextResponse(processedCode, {
      headers: {
        'Content-Type': 'text/javascript',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: errorMessage,
      success: false,
    }
  }
})

/**
 * Process code from functions (existing functionality)
 */
async function processFunctions() {
  const payload = await getPayload({ config })

  const { docs: functions } = await payload.find({
    collection: 'functions',
    where: {
      type: {
        equals: 'Code',
      },
    },
  })

  const results = []

  for (const func of functions) {
    if (!func.code) continue

    try {
      const task = await payload.create({
        collection: 'tasks',
        data: {
          title: `Process Code Function: ${func.name}`,
          description: `Process code from function ${func.name} (${func.id}) using esbuild to create modules and packages. Function ID: ${func.id}`,
          status: 'todo',
        },
      })

      results.push({
        function: func.name,
        taskId: task.id,
        success: true,
        message: 'Task created to process function code',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({
        function: func.name,
        error: errorMessage,
        success: false,
      })
    }
  }

  return {
    processed: results.length,
    results,
  }
}

/**
 * Process code from request body
 * Supports options in URL path: /[options]
 * Example: /target=es2015,minify
 */
export const POST = API(async (req, ctx) => {
  const { pathname } = new URL(req.url)
  const pathSegments = pathname.replace(/^\/esbuild\//, '').split('/')

  if (ctx.req.json) {
    try {
      const { functionId } = await ctx.req.json()

      if (functionId) {
        return processFunctionById(functionId)
      }
    } catch (error) {}
  }

  let optionsString = ''
  if (pathSegments.length > 0 && pathSegments[0]) {
    optionsString = pathSegments[0]
  }

  const options = parseOptions(optionsString)
  const esbuildOptions = convertToESBuildOptions(options)

  try {
    const code = await req.text()

    if (!code) {
      return {
        error: 'Code is required in the request body',
        success: false,
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/esbuild`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        options: esbuildOptions,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      return {
        error: result.error || 'Failed to process code',
        success: false,
      }
    }

    const processedCode = result.code

    return new NextResponse(processedCode, {
      headers: {
        'Content-Type': 'text/javascript',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: errorMessage,
      success: false,
    }
  }
})

/**
 * Process a specific function by ID (existing functionality)
 */
async function processFunctionById(functionId: string) {
  if (!functionId) {
    return {
      error: 'Function ID is required',
      success: false,
    }
  }

  const payload = await getPayload({ config })

  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId,
    })

    if (!func || func.type !== 'Code' || !func.code) {
      return {
        error: 'Function not found or not a Code type function',
        success: false,
      }
    }

    const task = await payload.create({
      collection: 'tasks',
      data: {
        title: `Process Code Function: ${func.name}`,
        description: `Process code from function ${func.name} (${func.id}) using esbuild to create modules and packages. Function ID: ${func.id}`,
        status: 'todo',
      },
    })

    return {
      function: func.name,
      taskId: task.id,
      success: true,
      message: 'Task created to process function code',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: errorMessage,
      success: false,
    }
  }
}
