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
    // Handle node: imports by excluding them from client-side bundles
    if (!isServer) {
      // Add rule to exclude node: imports in client-side bundles
      config.module = config.module || {}
      config.module.rules = config.module.rules || []
      
      // Add rule to handle node: scheme imports
      config.module.rules.push({
        test: /node:(.*)$/,
        use: 'null-loader',
      })
    }
    
    return config
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
