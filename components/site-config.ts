import { FaDiscord, FaGithub } from 'react-icons/fa'
import logo from '@/public/favicon/faviconDo.png'

export const siteConfig = {
  name: '.do',
  logo,
  url: 'https://dotdo.ai/',
  description: 'Agentic Workflow Platform. Redefining work with Businesses-as-Code.',
  baseLinks: {
    home: '/',
    docs: '/docs',
    pricing: '/pricing',
    api: '/api',
    sdk: '/docs/sdks',
    dashboard: '/admin',
    github: 'https://github.com/drivly/ai',
    discord: 'https://discord.gg/26nNxZTz9X',
    twitter: 'https://x.com/dotdo_ai',
    npm: 'https://www.npmjs.com/package/workflows.do',
    blog: '/blog',
    waitlist: '/waitlist',
    terms: '/terms',
    privacy: '/privacy',
  },
}

export type siteConfig = typeof siteConfig

export const navigation = [
  { name: 'Docs', href: siteConfig.baseLinks.docs },
  { name: 'Pricing', href: siteConfig.baseLinks.pricing },
  { name: 'API', href: siteConfig.baseLinks.api },
  { name: 'SDK', href: siteConfig.baseLinks.sdk },
  { name: 'Dashboard', href: siteConfig.baseLinks.dashboard },
  { name: 'Blog', href: siteConfig.baseLinks.blog },
  { name: 'GitHub', href: siteConfig.baseLinks.github, icon: FaGithub, target: '_blank', rel: 'noopener noreferrer' },
  { name: 'Discord', href: siteConfig.baseLinks.discord, icon: FaDiscord, target: '_blank', rel: 'noopener noreferrer' },
] as const
