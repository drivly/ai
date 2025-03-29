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
  transpilePackages: ['simple-payload', 'clickable-apis', 'ai-models', 'payload'],
  webpack: (config, { isServer }) => {
    // Handle node: imports
    if (!isServer) {
      config.resolve = config.resolve || {}
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        module: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        zlib: false,
        process: false,
      }
      
      // Add rule to handle node: scheme imports
      config.module = config.module || {}
      config.module.rules = config.module.rules || []
      config.module.rules.push({
        test: /node:(.*)$/,
        use: 'null-loader',
      })
    }
    
    // Add rule to ignore node: imports in build scripts
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /build-.*\.ts$/,
      use: 'ignore-loader',
    })
    
    // Add alias for payload config
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@payload-config'] = resolve('./payload.config.js')
    
    return config
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
