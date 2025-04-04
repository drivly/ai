import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'

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
  transpilePackages: ['@drivly/ui', '@drivly/payload-agent', 'simple-payload', 'clickable-apis'],
  async redirects() {
    return [
      {
        source: '/docs/things',
        destination: '/docs/resources',
        permanent: true,
      },
      {
        source: '/docs/things/:path*',
        destination: '/docs/resources/:path*',
        permanent: true,
      },
    ]
  },
  // All routing is handled by middleware.ts
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
