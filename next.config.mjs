import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  // ... Other Nextra config options
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: ['simple-payload', 'clickable-apis', 'ai-models'],
  webpack: (config, { isServer }) => {
    // Handle node: imports
    if (!isServer) {
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
      }
    }
    
    // Add rule to ignore node: imports in build scripts
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /build-.*\.ts$/,
      use: 'ignore-loader',
    })
    
    return config
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
