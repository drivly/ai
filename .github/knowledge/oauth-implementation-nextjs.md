# OAuth Implementation in Next.js App Router

## Route Structure

For a complete OAuth implementation in Next.js App Router, use the following route structure:

```
app/
  (apis)/
    oauth/
      route.ts                    # Main OAuth authorization endpoint
      callback/
        [provider]/
          route.ts                # Provider callback handler
      token/
        route.ts                  # Token exchange endpoint
      register/
        route.ts                  # Client registration endpoint
      clients/
        route.ts                  # List registered clients
      continue/
        route.ts                  # Handle authenticated redirects
```

## Authorization Endpoint (route.ts)

```typescript
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const provider = url.searchParams.get('provider')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')
  
  // Validate parameters
  
  // Generate login URL with state
  const loginUrl = new URL('/api/auth/signin', request.url)
  loginUrl.searchParams.set('redirect', `/api/oauth?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state ? encodeURIComponent(state) : ''}`)
  
  return { redirect: loginUrl.toString() }
}
```

## Callback Handler ([provider]/route.ts)

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider
  const code = new URL(request.url).searchParams.get('code')
  
  // Validate code
  
  // Exchange code for token
  
  // Redirect to original redirect_uri with code
}
```

## Token Exchange (token/route.ts)

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { code, client_id, client_secret } = body
  
  // Validate client credentials
  
  // Exchange code for token
  
  return NextResponse.json({ access_token, token_type: 'Bearer', expires_in: 3600 })
}
```

## Best Practices

1. Always validate all input parameters
2. Use proper error handling with standardized OAuth error responses
3. Implement proper state parameter handling for security
4. Store client credentials securely
5. Use proper token expiration and refresh mechanisms
6. Implement proper scopes for access control
7. Follow OAuth 2.0 specifications for error responses
