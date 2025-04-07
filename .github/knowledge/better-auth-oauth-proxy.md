# Better Auth oAuthProxy Configuration

## Basic Configuration

When configuring the oAuthProxy plugin in better-auth, use the following pattern:

```typescript
oAuthProxy({
  productionURL: 'https://your-production-domain.com',
  currentURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
})
```

## Handling Vercel Preview Deployments

For Vercel preview deployments, implement a comprehensive URL detection strategy:

```typescript
oAuthProxy({
  productionURL: 'https://apis.do',
  currentURL:
    typeof window !== 'undefined'
      ? window.location.origin // Client-side detection
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : process.env.VERCEL_BRANCH_URL
            ? process.env.VERCEL_BRANCH_URL
            : process.env.VERCEL_PREVIEW_URL
              ? process.env.VERCEL_PREVIEW_URL
              : process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
})
```

## Provider Configuration

When configuring OAuth providers, always specify the redirectURI explicitly:

```typescript
export const authOptions: AuthOptions = {
  socialProviders: {
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
  },
}
```

## Best Practices

1. Use a comprehensive URL detection strategy for Vercel preview deployments
2. Explicitly set `redirectURI` for each provider to ensure consistent callback URLs
3. Use environment variables for client IDs and secrets
4. Follow the URL pattern: `https://domain.com/api/auth/callback/provider`
5. Ensure your OAuth routes use the API wrapper pattern for consistent error handling
