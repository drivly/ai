import { NextRequest, NextResponse } from 'next/server'
import { isBot, APIHeader } from '../../../lib/api'

export const runtime = 'edge'

/**
 * Test API endpoint for bot detection with URLs in JSON
 * This endpoint is edge runtime compatible
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
    const url = new URL(req.url)
    const domain = url.hostname
    const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')
    const title = apiHeader.name || domain
    const description = apiHeader.description || 'API Response'
    const jsonPreviewUrl = `${origin}/opengraph-image?title=${encodeURIComponent(title)}`
    
    const htmlResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - API Response</title>
  <meta name="description" content="${description}">
  
  <!-- OpenGraph meta tags -->
  <meta property="og:title" content="${title} - API Response">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${jsonPreviewUrl}">
  <meta property="og:url" content="${req.url}">
  <meta property="og:type" content="website">
  
  <!-- Twitter card tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} - API Response">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${jsonPreviewUrl}">
  
  <!-- Additional SEO metadata -->
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${req.url}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
    }
    pre a {
      color: #0366d6;
      text-decoration: none;
    }
    pre a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>${title} - API Response</h1>
  <pre>${JSON.stringify(response, null, 2)}</pre>
</body>
</html>`
    
    return new NextResponse(htmlResponse, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  }
  
  return NextResponse.json(response)
}
