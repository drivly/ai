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
 
  transpilePackages: ['simple-payload', 'clickable-apis'],
}

// Apply Nextra and Payload plugins first
const baseConfig = withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))

// Completely disable Sentry during build process
// Only enable client-side Sentry at runtime
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

// Skip Sentry during build phase to avoid Nextra metadata generation issues
const config = isBuildPhase
  ? baseConfig // Use base config without Sentry during build
  : withSentryConfig(
      baseConfig,
      {
        // Additional options for the Sentry webpack plugin
        silent: true, // Suppresses all logs
      },
      {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/
        hideSourceMaps: true,
        disableServerWebpackPlugin: true, // Disable server-side Sentry
        disableServerSideInstrumentation: true, // Disable server-side instrumentation
      }
    );

export default config;
