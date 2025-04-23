import { withSentryConfig } from '@sentry/nextjs'
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
    codeblocks: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: ['payload-utils', 'simple-payload', 'clickable-apis', 'payload-agent'], // Include internal packages

  turbopack: {
    // Using Turbopack for faster builds and better performance
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config, { isServer, dev, buildId, config: { distDir } }) => {
    // Add YAML loader for all contexts
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
    })
    
    // Fix OpenTelemetry HTTP instrumentation for Sentry compatibility
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@opentelemetry/instrumentation-http/build/src/http'] = 
      path.resolve(dirname, './opentelemetry-http-instrumentation-shim.js')
    
    // Suppress OpenTelemetry instrumentation warnings
    config.ignoreWarnings = [
      {
        module: /node_modules\/@opentelemetry\/instrumentation/,
      },
    ]
    
    // Memory optimizations
    if (!dev) {
      // Disable source maps in production to reduce memory usage
      config.devtool = false;
    }
    
    // Handle Node.js modules used by Remotion renderer
    // These are needed for the build process but not for runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        'child_process': false,
        'fs': false,
        'path': false,
        'os': false,
        'stream': false,
        'util': false,
        'zlib': false,
        'url': false,
      };
      
      // Use node: protocol externals for server-only code
      config.externals.push({
        'node:process': 'process',
        'node:assert': 'assert',
        'node:child_process': 'child_process',
        'node:dns': 'dns',
        'node:fs': 'fs',
        'node:http': 'http',
        'node:https': 'https',
        'node:module': 'module',
        'node:net': 'net',
        'node:os': 'os',
        'node:path': 'path',
        'node:stream': 'stream',
        'node:url': 'url',
        'node:util': 'util',
        'node:zlib': 'zlib',
      });
      
      // Add fallback for 'net' module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'net': false,
      };
    }
    return config
  },
}

// Configure bundle analyzer to run only when ANALYZE=true
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Apply wrappers in the correct order for proper metadata generation
// withNextra must be the outermost wrapper for metadata to work correctly
export default withNextra(
  withSentryConfig(
    analyzeBundles(
      withPayload(nextConfig, {
        devBundleServerPackages: false,
        adminRoute: '/admin',
        configPath: path.resolve(dirname), // Point to root directory where payload.config.ts exists
      })
    ),
    {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: "drivly",
      project: "ai",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      tunnelRoute: "/monitoring",

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      automaticVercelMonitors: true,
    }
  )
)

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
