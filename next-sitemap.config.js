/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://workflows.do',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*', '/sites/*'],
  generateIndexSitemap: false,
  outDir: '.next/server',
  transform: async (config, path) => {
    if (path.startsWith('/docs')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
