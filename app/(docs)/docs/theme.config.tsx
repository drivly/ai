import { DocsThemeConfig } from 'nextra-theme-docs'

const themeConfig: DocsThemeConfig = {
  logo: <span>Workflows.do</span>,
  project: {
    link: 'https://github.com/drivly/ai',
  },
  chat: {
    link: 'https://discord.gg/a87bSRvJkx',
  },
  docsRepositoryBase: 'https://github.com/drivly/ai/tree/main',
  footer: {
    text: 'MIT © Workflows.do',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  navigation: {
    prev: true,
    next: true,
  },
}

export default themeConfig
