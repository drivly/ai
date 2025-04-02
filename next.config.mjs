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
  async rewrites() {
    return {
      beforeFiles: [
        // Special case for Vercel preview domains
        {
          source: '/',
          destination: '/sites-list',
          has: [
            {
              type: 'host',
              value: '(.*)\\.dev\\.driv\\.ly',
            },
          ],
        },
        // Special case for do.mw
        {
          source: '/',
          destination: '/sites-list',
          has: [
            {
              type: 'host',
              value: 'do\\.mw',
            },
          ],
        },
        // Additional rewrite for do.mw with higher priority
        {
          source: '/:path*',
          destination: '/sites-list',
          has: [
            {
              type: 'host',
              value: 'do\\.mw',
            },
          ],
        },
        // Special case for apis.do/sites
        {
          source: '/sites',
          destination: '/sites-list',
          has: [
            {
              type: 'host',
              value: 'apis\\.do',
            },
          ],
        },
      ],
    }
  },
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
