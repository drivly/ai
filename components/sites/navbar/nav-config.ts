import { FaDiscord, FaGithub } from 'react-icons/fa'

export const navLinks = [
  {
    label: 'Docs',
    href: '/docs',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'API',
    href: '/api',
  },
  {
    label: 'SDK',
    href: '/docs/sdks',
  },
  {
    label: 'Dashboard',
    href: '/admin',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/drivly/ai',
    target: '_blank',
    rel: 'noopener noreferrer',
    Icon: FaGithub,
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/26nNxZTz9X',
    target: '_blank',
    rel: 'noopener noreferrer',
    Icon: FaDiscord,
  },
]
