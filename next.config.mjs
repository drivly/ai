import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import { resolve } from 'path'

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
    // Add alias for payload config
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@payload-config'] = resolve('./payload.config.js')
    
    // Exclude test files from build
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    })
    
    // Handle node: imports in client-side code
    if (!isServer) {
      // Exclude payload from client bundle
      config.module.rules.push({
        test: /payload/,
        use: 'null-loader',
      })
      
      // Exclude node: imports from client bundle
      config.module.rules.push({
        test: /node:(.*)$/,
        use: 'null-loader',
      })
    }
    
    return config
  },
  experimental: {
    serverExternalPackages: ['payload']
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
