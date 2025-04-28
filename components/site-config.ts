import { FaDiscord, FaGithub } from 'react-icons/fa'
import { RiDiscordFill, RiGithubFill, RiNpmjsFill, RiTwitterXFill } from '@remixicon/react'
import { extractApiNameFromDomain, docsExistForApi, getDocsPath } from '@/lib/domains'

/**
 * Get the appropriate docs link based on the hostname
 * Falls back to '/docs' for domains without specific documentation
 */
export const getDocsLink = (hostname: string = ''): string => {
  if (!hostname) return '/docs'

  const apiName = extractApiNameFromDomain(hostname)
  if (docsExistForApi(apiName)) {
    return getDocsPath(hostname)
  }

  return '/docs'
}

/**
 * Get the current hostname
 * This function works in both client and server contexts
 */
export const getCurrentHostname = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.hostname
  }

  return ''
}

export const siteConfig = {
  name: '.do',
  logo: '/favicon/faviconDo.png',
  url: 'https://dotdo.ai',
  description: 'Agentic Workflow Platform. Redefining work with Businesses-as-Code.',
  baseLinks: {
    home: '/',
    docs: '/docs',
    pricing: '/pricing',
    api: '/api',
    sdk: '/docs/sdks',
    dashboard: '/admin',
    github: 'https://github.com/drivly/ai',
    docs_repo_base: 'https://github.com/drivly/ai/tree/main',
    discord: 'https://discord.gg/26nNxZTz9X',
    discord_chat_link: 'https://discord.gg/tafnNeUQdm',
    twitter: 'https://x.com/dotdo_ai',
    npm: 'https://www.npmjs.com/package/workflows.do',
    blog: '/blog',
    waitlist: '/waitlist',
    products: {
      workflows: 'https://workflows.do/',
      functions: 'https://functions.do/',
      llm: 'https://llm.do/',
      apis: 'https://apis.do/',
      directory: 'https://dotdo.ai/',
    },
    developers: {
      docs: 'https://workflows.do/docs',
      changelog: '/changelog',
      reference: 'https://docs.apis.do/reference#tag/functions',
      status: 'https://status.workflows.do',
    },
    resources: {
      blog: '/blog',
      pricing: '/pricing',
      enterprise: 'mailto:sales@dotdo.ai',
    },
    company: {
      about: '/docs/manifesto',
      careers: 'https://careers.do',
      contact: 'mailto:sales@dotdo.ai',
      privacy: '/privacy',
      terms: '/terms',
    },
  },
}

export type siteConfig = typeof siteConfig

export const getNavigation = (hostname: string = '') =>
  [
    { name: 'Docs', href: getDocsLink(hostname) },
    { name: 'Pricing', href: siteConfig.baseLinks.pricing },
    { name: 'API', href: siteConfig.baseLinks.api },
    { name: 'CLI', href: '/docs/cli' },
    { name: 'SDK', href: siteConfig.baseLinks.sdk },
    { name: 'Dashboard', href: siteConfig.baseLinks.dashboard },
    { name: 'Blog', href: siteConfig.baseLinks.blog },
    { name: 'GitHub', href: siteConfig.baseLinks.github, icon: FaGithub, external: true },
    { name: 'Discord', href: siteConfig.baseLinks.discord, icon: FaDiscord, external: true },
  ] as const

export const navigation = getNavigation()

const productLinks = [
  { name: 'Workflows.do', href: siteConfig.baseLinks.products.workflows, external: false },
  { name: 'Functions.do', href: siteConfig.baseLinks.products.functions, external: false },
  { name: 'LLM.do', href: siteConfig.baseLinks.products.llm, external: false },
  { name: 'APIs.do', href: siteConfig.baseLinks.products.apis, external: false },
  { name: 'Directory', href: siteConfig.baseLinks.products.directory, external: false },
]

const developerLinks = [
  { name: 'Docs', href: siteConfig.baseLinks.developers.docs, external: true },
  { name: 'APIs', href: siteConfig.baseLinks.products.apis, external: true },
  { name: 'SDKs', href: siteConfig.baseLinks.sdk, external: false },
  { name: 'CLIs', href: '/docs/cli', external: false },
  { name: 'Changelog', href: siteConfig.baseLinks.developers.changelog, external: true },
  { name: 'Reference', href: siteConfig.baseLinks.developers.reference, external: true },
]

const resourceLinks = [
  { name: 'Blog', href: siteConfig.baseLinks.resources.blog, external: false },
  { name: 'Pricing', href: siteConfig.baseLinks.resources.pricing, external: false },
  { name: 'Enterprise', href: siteConfig.baseLinks.resources.enterprise, external: true },
]

const companyLinks = [
  { name: 'About', href: siteConfig.baseLinks.company.about, external: false },
  { name: 'Careers', href: siteConfig.baseLinks.company.careers, external: true },
  { name: 'Contact', href: siteConfig.baseLinks.company.contact, external: true },
  { name: 'Privacy', href: siteConfig.baseLinks.company.privacy, external: false },
  { name: 'Terms', href: siteConfig.baseLinks.company.terms, external: false },
]

const socialLinks = [
  { name: 'GitHub', href: siteConfig.baseLinks.github, external: true, icon: RiGithubFill },
  { name: 'Discord', href: siteConfig.baseLinks.discord, external: true, icon: RiDiscordFill },
  { name: 'Twitter', href: siteConfig.baseLinks.twitter, external: true, icon: RiTwitterXFill },
  { name: 'NPM', href: siteConfig.baseLinks.npm, external: true, icon: RiNpmjsFill },
]

export const footerNavigation = {
  products: productLinks,
  developers: developerLinks,
  resources: resourceLinks,
  company: companyLinks,
  social: socialLinks,
}
