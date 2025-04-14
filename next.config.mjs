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
  experimental: {
    // instrumentationHook: true, // Deprecated: instrumentation.js is available by default
  }
}

// Configure bundle analyzer to run only when ANALYZE=true
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Apply Sentry configuration
const withSentry = withSentryConfig(
  // Base Next.js config with Nextra and Payload
  withNextra(withPayload(nextConfig, { 
    devBundleServerPackages: false,
    adminRoute: '/admin',
    configPath: path.resolve(dirname, 'app/(admin)'),
  })),
  // Sentry specific options
  {
    org: "drivly",
    project: "ai",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);

// Apply bundle analyzer if ANALYZE=true
export default analyzeBundles(withSentry)
