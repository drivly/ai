import { withSentryConfig } from '@sentry/nextjs';
import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import withBundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * @type {import('nextra').NextraConfig<import('nextra-theme-docs').DocsThemeConfig>}
 */
const withNextra = nextra({
  codeHighlight: true,
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true,
  latex: true,
  search: {
    codeblocks: false,
  },

})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: ['@drivly/ui', '@drivly/payload-agent', 'simple-payload', 'clickable-apis', 'ai-models', 'payload-utils', 'payload-hooks-queue'],
  // All routing is handled by middleware.ts
  productionBrowserSourceMaps: true, // Enable sourcemap generation in production
  experimental: {
    instrumentationHook: true,
  }
}

// Configure bundle analyzer to run only when ANALYZE=true
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default analyzeBundles(withNextra(withPayload(nextConfig, { 
  devBundleServerPackages: false,
  adminRoute: '/admin',
  configPath: path.resolve(dirname, 'app/(admin)'),
})))

// TODO: We need to figure out the build errors here
// export default withNextra(withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
// // For all available options, see:
// // https://www.npmjs.com/package/@sentry/webpack-plugin#options

// org: "drivly",
// project: "ai",

// // Only print logs for uploading source maps in CI
// silent: !process.env.CI,

// // For all available options, see:
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// // Upload a larger set of source maps for prettier stack traces (increases build time)
// widenClientFileUpload: true,

// // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// // This can increase your server load as well as your hosting bill.
// // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// // side errors will fail.
// tunnelRoute: "/monitoring",

// // Automatically tree-shake Sentry logger statements to reduce bundle size
// disableLogger: true,

// // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// // See the following for more information:
// // https://docs.sentry.io/product/crons/
// // https://vercel.com/docs/cron-jobs
// automaticVercelMonitors: true,
// }))
