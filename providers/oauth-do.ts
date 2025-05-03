import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth'

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
  return {
    id: 'oauth-do',
    name: 'OAuth.do',
    type: 'oauth',
    wellKnown: `${process.env.OAUTH_DO_ISSUER || 'https://oauth.do'}/api/auth/.well-known/openid-configuration`,
    authorization: { params: { scope: 'openid profile email' } },
    idToken: true,
    checks: ['pkce', 'state'],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
