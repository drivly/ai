import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import { remarkCodeHike } from '@code-hike/mdx'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  mdxOptions: {
    remarkPlugins: [
      [remarkCodeHike, { theme: 'github-dark' }]
    ]
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: ['@drivly/ui', '@drivly/payload-agent', 'simple-payload', 'clickable-apis'],
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
