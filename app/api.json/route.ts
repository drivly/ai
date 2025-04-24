import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

/**
 * Serve the static OpenAPI specification file from the public directory
 * This ensures the schema is properly served at the root path
 */
export async function GET() {
  try {
    const apiJsonPath = path.join(process.cwd(), 'public', 'api.json')
    const content = await fs.readFile(apiJsonPath, 'utf8')
    
    const response = NextResponse.json(JSON.parse(content))
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('Error serving api.json:', error)
    return NextResponse.json({ error: 'Schema not found' }, {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
