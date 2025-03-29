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
  transpilePackages: ['simple-payload', 'clickable-apis', 'ai-models'],
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
    
    // Add aliases for node: imports
    config.resolve.alias['node:fs'] = 'browserify-fs'
    config.resolve.alias['node:path'] = 'path-browserify'
    config.resolve.alias['node:os'] = 'os-browserify/browser'
    config.resolve.alias['node:process'] = 'process/browser'
    config.resolve.alias['node:module'] = 'module-polyfill'
    
    return config
  }
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
