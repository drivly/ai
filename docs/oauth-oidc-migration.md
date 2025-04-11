# OAuth & OIDC Migration Guide

This document outlines the migration plan from the custom OAuth implementation to the Better Auth OIDC plugin.

## Current Implementation

The current OAuth implementation uses three custom collections:
- `collections/auth/OAuthClients.ts`: Stores OAuth client applications
- `collections/auth/OAuthCodes.ts`: Manages OAuth authorization codes
- `collections/auth/OAuthTokens.ts`: Stores OAuth access tokens

These collections are registered in `collections/index.ts` and have corresponding API routes in `app/(apis)/oauth/`.

## Better Auth OIDC Implementation

The Better Auth OIDC plugin has been added to the configuration in `lib/auth/options.ts`. This plugin provides standardized OAuth 2.0 and OpenID Connect functionality that external services like Zapier, Vercel, and OpenAI can use.

The plugin automatically registers the following collections:
- `oauthApplications`: Stores OAuth client applications
- `oauthAccessTokens`: Manages OAuth access tokens
- `oauthConsents`: Tracks user consent for OAuth applications

## Migration Plan

### Phase 1: Initial Implementation (Completed)
- Added the OIDC provider plugin to Better Auth configuration in `lib/auth/options.ts`
- Kept existing custom OAuth collections for backward compatibility
- Configured the plugin with appropriate endpoints, scopes, and token lifetimes

### Phase 2: API Route Updates
- Update API routes in `app/(apis)/oauth/` to use Better Auth OIDC functionality
- Create migration scripts to transfer existing OAuth clients to the new collections
- Implement user consent flow using Better Auth OIDC

### Phase 3: Collection Removal
- Remove custom OAuth collections from `collections/index.ts`
- Remove custom OAuth collection files from `collections/auth/`
- Update any remaining code that references the custom collections

## API Routes to Update

The following API routes will need to be updated to use Better Auth OIDC functionality:
- `app/(apis)/oauth/route.ts`: Authorization endpoint
- `app/(apis)/oauth/token/route.ts`: Token endpoint
- `app/(apis)/oauth/clients/route.ts`: Client management
- `app/(apis)/oauth/register/route.ts`: Client registration
- `app/(apis)/oauth/callback/[provider]/route.ts`: OAuth callback
- `app/(apis)/oauth/continue/route.ts`: OAuth continuation

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenID Connect Specification](https://openid.net/connect/)
