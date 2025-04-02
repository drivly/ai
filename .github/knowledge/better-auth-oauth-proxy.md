# Better Auth oAuthProxy Configuration

## Basic Configuration

When configuring the oAuthProxy plugin in better-auth, use the following pattern:

```typescript
oAuthProxy({
  productionURL: 'https://your-production-domain.com',
  currentURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
              process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  callbackPath: '/api/auth/callback'
})
```

## Handling Vercel Preview Deployments

For Vercel preview deployments, implement a comprehensive URL detection strategy:

```typescript
oAuthProxy({ 
  productionURL: 'https://apis.do',
  currentURL: typeof window !== 'undefined' ? window.location.origin : // Client-side detection
              process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
              process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 
              process.env.VERCEL_BRANCH_URL ? process.env.VERCEL_BRANCH_URL : 
              process.env.VERCEL_PREVIEW_URL ? process.env.VERCEL_PREVIEW_URL : 
              process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
  callbackPath: '/api/auth/callback'
})
```

## Provider Configuration

When configuring OAuth providers, always specify the redirectURI explicitly:

```typescript
export const authOptions: AuthOptions = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: 'https://apis.do/api/auth/callback/google',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: 'https://apis.do/api/auth/callback/github',
    },
  }
}
```

## Best Practices

1. Always specify the `callbackPath` to ensure consistent callback URL patterns
2. Use a comprehensive URL detection strategy for Vercel preview deployments
3. Explicitly set `redirectURI` for each provider to ensure consistent callback URLs
4. Use environment variables for client IDs and secrets
5. Follow the URL pattern: `https://domain.com/api/auth/callback/provider`
