import { NextRequest, NextResponse } from 'next/server'
import { isBot, generateBotHtml, APIHeader } from '@/lib/api'

export const runtime = 'edge'

/**
 * Test API endpoint for bot detection with URLs in JSON
 */
export const GET = async (req: NextRequest) => {
  const apiHeader: APIHeader = {
    name: 'Test Bot Detection API',
    description: 'API for testing bot detection and URL conversion',
    home: 'https://drivly.com',
    login: 'https://drivly.com/login',
    signup: 'https://drivly.com/signup',
    admin: 'https://drivly.com/admin',
    docs: 'https://docs.drivly.com',
    repo: 'https://github.com/drivly/ai',
    sdk: 'https://www.npmjs.com/package/@drivly/api',
    site: 'https://drivly.com',
    version: '1.0.0',
  }

  const response = {
    api: apiHeader,
    links: {
      website: 'https://drivly.com',
      docs: 'https://docs.drivly.com',
      github: 'https://github.com/drivly',
    },
    examples: [
      {
        name: 'Simple URL',
        url: 'https://example.com',
      },
      {
        name: 'Nested URL',
        data: {
          url: 'https://nested.example.com',
          nonUrl: 'This is not a URL',
        },
      },
    ],
    arrayOfUrls: [
      'https://array1.example.com',
      'https://array2.example.com',
      'Not a URL',
    ],
    message: 'This response contains URLs that should be converted to links for bots',
  }

  if (isBot(req)) {
    const htmlResponse = generateBotHtml(req, apiHeader, response)
    
    return new NextResponse(htmlResponse, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  }
  
  return NextResponse.json(response)
}
