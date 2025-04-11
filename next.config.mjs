import { withSentryConfig } from '@sentry/nextjs';
import nextra from 'nextra'
import { withPayload } from '@payloadcms/next/withPayload'
import withBundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * @type {import('nextra').NextraConfig<import('nextra-theme-docs').DocsThemeConfig>}
 */
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
  // Disable all optimizations to prevent stack overflow
  reactStrictMode: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // Disable all experimental features
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
    serverActions: {
      bodySizeLimit: '2mb',
    },
    mdxRs: false
  },
  
  // Exclude all documentation routes to prevent stack overflow
  async rewrites() {
    return {
      beforeFiles: [
        // Redirect all documentation routes to a static page
        {
          source: '/docs/:path*',
          destination: '/api',
        },
        // Redirect reference page specifically to avoid placeholder.js error
        {
          source: '/docs/reference',
          destination: '/api/reference',
        },
      ],
    }
  },
  
  // Disable experimental features to prevent stack overflow
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
    serverActions: {
      bodySizeLimit: '2mb',
    },
    mdxRs: false
  },
  
  // Exclude SDK documentation pages from the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => {
    // During build, if SKIP_NEXTRA is true, exclude mdx files
    if (process.env.SKIP_NEXTRA === 'true') {
      return ext !== 'mdx';
    }
    return true;
  })
}

// Configure bundle analyzer to run only when ANALYZE=true
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Conditionally apply Nextra based on SKIP_NEXTRA env var
const skipNextra = process.env.SKIP_NEXTRA === 'true'

// Create a custom Nextra config that skips SDK routes
const customNextraConfig = (config) => {
  // If we're skipping Nextra entirely, just return the base config
  if (skipNextra) {
    return config;
  }
  
  // Otherwise, apply Nextra but with custom handling
  const nextraConfig = withNextra(config);
  
  return {
    ...nextraConfig,
    webpack: (webpackConfig, options) => {
      // Apply the original Nextra webpack config
      const newConfig = typeof nextraConfig.webpack === 'function'
        ? nextraConfig.webpack(webpackConfig, options)
        : webpackConfig;
      
      return newConfig;
    }
  };
};

// Export the final config
const finalConfig = analyzeBundles(
  customNextraConfig(
    withPayload(nextConfig, {
      devBundleServerPackages: false,
      adminRoute: '/admin',
      configPath: path.resolve(dirname, 'app/(admin)'),
    })
  )
)

export default finalConfig

// TODO: We need to figure out the build errors here
// export default withNextra(withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
// // For all available options, see:
// // https://www.npmjs.com/package/@sentry/webpack-plugin#options

// org: "drivly",
// project: "ai",

// // Only print logs for uploading source maps in CI
// silent: !process.env.CI,

// // For all available options, see:
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// // Upload a larger set of source maps for prettier stack traces (increases build time)
// widenClientFileUpload: true,

// // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// // This can increase your server load as well as your hosting bill.
// // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// // side errors will fail.
// tunnelRoute: "/monitoring",

// // Automatically tree-shake Sentry logger statements to reduce bundle size
// disableLogger: true,

// // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// // See the following for more information:
// // https://docs.sentry.io/product/crons/
// // https://vercel.com/docs/cron-jobs
// automaticVercelMonitors: true,
// }))
