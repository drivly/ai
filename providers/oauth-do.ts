import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

interface OAuthDoProfile {
  sub: string
  iss: string
  name?: string
  email?: string
  picture?: string
}

export default function OAuthDo<P extends OAuthDoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const issuer = process.env.OAUTH_DO_ISSUER || 'http://localhost:3000';
  
  return {
    id: 'oauth-do',
    name: 'OAuth.do',
    type: 'oauth',
    issuer,
    authorization: {
      url: `${issuer}/api/auth/oauth2/authorize`,
      params: { scope: 'openid profile email' }
    },
    token: `${issuer}/api/auth/oauth2/token`,
    userinfo: `${issuer}/api/auth/oauth2/userinfo`,
    checks: ['pkce', 'state'],
    profile(profile: OAuthDoProfile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  }
}
