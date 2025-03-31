import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  // ... Other Nextra config options
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
 
  transpilePackages: ['@drivly/ui', 'simple-payload', 'clickable-apis'],
}

// Apply Nextra and Payload plugins first
const baseConfig = withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))

// Apply Sentry configuration
export default withSentryConfig(
  baseConfig,
  {
    // Additional options for the Sentry webpack plugin
    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/
    hideSourceMaps: true,
  }
)
