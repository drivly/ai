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
 
  // Sentry webpack plugin configuration
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See:
    // https://webpack.js.org/configuration/devtool/
    //
    // You can also use other values for development:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    hideSourceMaps: true,
  },
}

// Apply Sentry, Nextra, and Payload plugins
const sentryWebpackPluginOptions = {
  // Additional options for the Sentry webpack plugin
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
}

// Apply plugins in the correct order
export default withSentryConfig(
  withNextra(withPayload(nextConfig, { devBundleServerPackages: false })),
  sentryWebpackPluginOptions
)
