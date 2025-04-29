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
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
  latex: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using Turbopack for faster builds and better performance
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  // Generate static HTML files for all routes
  output: 'export',
}

// Configure bundle analyzer to run only when ANALYZE=true
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Export with Sentry, Nextra, and Payload integration
// Maintain the same wrapper order as the original configuration
export default analyzeBundles(
  withNextra(
    withPayload(nextConfig, {
      devBundleServerPackages: false,
      adminRoute: '/admin',
      configPath: path.resolve(dirname), // Point to root directory where payload.config.ts exists
    }),
  ),
)
