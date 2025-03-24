import { NextRequest, NextResponse } from 'next/server'
import { generateMarkdown } from '@/tasks/generateMarkdown'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    
    // Call the generateMarkdown function with the request body
    const result = await generateMarkdown({
      input: body,
      req
    })
    
    // Return the result as JSON
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in generate-markdown API:', error)
    
    // Return an error response
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while generating markdown',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}