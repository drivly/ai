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
  transpilePackages: ['@drivly/ui'],
 
  transpilePackages: ['simple-payload', 'clickable-apis', '@drivly/ui']
 
}

export default withNextra(withPayload(nextConfig, { devBundleServerPackages: false }))
