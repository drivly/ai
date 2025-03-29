import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import { resolve } from 'path'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  // ... Other Nextra config options
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: [
    'simple-payload', 
    'clickable-apis', 
    'ai-models',
    'ai-functions',
    'ai-providers',
    'ai-workflows',
    'deploy-worker',
    'payload-agent',
    'payload-utils'
  ],
  webpack: (config, { isServer }) => {
    // Add NodePolyfillPlugin to handle node: imports
    config.plugins = config.plugins || []
    config.plugins.push(new NodePolyfillPlugin())
    
    // Add alias for payload config
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@payload-config'] = resolve('./payload.config.js')
    
    // Add aliases for node: imports
    config.resolve.alias['node:fs'] = 'browserify-fs'
    config.resolve.alias['node:path'] = 'path-browserify'
    config.resolve.alias['node:os'] = 'os-browserify/browser'
    config.resolve.alias['node:process'] = 'process/browser'
    // Handle node:module with null-loader since module-polyfill is not available
    config.module.rules.push({
      test: /node:module/,
      use: 'null-loader',
    })
    
    // Exclude test files from build
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    })
    
    return config
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
