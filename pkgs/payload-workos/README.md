# Payload WorkOS Plugin

A Payload CMS plugin for integrating with [WorkOS](https://workos.com/) to provide enterprise-ready authentication and user management features.

## Overview

This plugin enables Payload CMS to leverage WorkOS services for enterprise-grade authentication and user management, including:

- **Single Sign-On (SSO)**: Support for SAML, Okta, Google, Microsoft, and more
- **Multi-factor Authentication (MFA)**: Add an extra layer of security
- **Directory Sync**: Synchronize user data from identity providers
- **Admin Portal**: Allow customers to self-manage their authentication
- **Magic Auth**: Passwordless authentication via email
- **User Management**: Simplified user provisioning and access control

## Features (Planned)

- [ ] SSO integration with Payload authentication
- [ ] Directory Sync for automatic user provisioning
- [ ] MFA support for enhanced security
- [ ] Admin Portal integration
- [ ] Magic Auth for passwordless login
- [ ] Secrets management for API keys and connection strings
- [ ] Webhooks for WorkOS events

## Installation

```bash
# Not yet published
npm install payload-workos
# or
yarn add payload-workos
# or
pnpm add payload-workos
```

## Environment Variables

The plugin uses the following environment variables:

```
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id
WORKOS_REDIRECT_URI=https://your-app.com/api/workos/sso/callback
```

These can also be provided directly in the plugin configuration.

## Usage

```typescript
// In your payload.config.ts
import { buildConfig } from 'payload/config'
import workosPlugin from 'payload-workos'

export default buildConfig({
  plugins: [
    workosPlugin({
      // Plugin options will go here
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
      // Additional configuration options
    }),
  ],
  // Other Payload configuration
})
```

## Configuration

The plugin will support various configuration options to customize the integration with WorkOS:

```typescript
interface WorkOSPluginConfig {
  // Required
  apiKey: string
  clientId: string

  // Optional
  redirectUri?: string
  organizationCollection?: string
  userCollection?: string
  // Additional options to be determined
}
```

## Integration with Existing Auth

This plugin is designed to work alongside Payload's authentication system or other auth plugins like next-auth. It will enhance the existing authentication with enterprise features rather than replacing it completely.

## Development Roadmap

1. Initial setup and configuration
2. SSO integration
3. Directory Sync
4. MFA support
5. Admin Portal integration
6. Magic Auth
7. Webhooks and event handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
