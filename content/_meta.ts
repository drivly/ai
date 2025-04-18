import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  docs: { type: 'page', title: 'Docs', href: '/docs' },
  api: { type: 'page', title: 'APIs', href: '/docs/apis' },
  sdk: { type: 'page', title: 'SDKs', href: '/docs/sdks' },
  clis: { type: 'page', title: 'CLI', href: '/docs/cli' },
  pricing: { type: 'page', title: 'Pricing', href: '/pricing' },
  dashboard: { type: 'page', title: 'Dashboard', href: '/admin' },
  ref: {
    type: 'page',
    title: 'Reference',
    href: 'https://apis.do/reference',
  },

  manifesto: '',
  primitives: '',

  _ai: {
    type: 'separator',
    title: 'AI',
  },
  functions: '',
  agents: '',
  workflows: '',

  _: {
    type: 'separator',
  },

  business: '',
  data: '',
  events: '',
  evaluations: '',
  experiments: '',
  integrations: '',
  deployment: '',
  observability: '',
  // sites: { display: 'hidden' }, // Removed as sites directory moved to repository root

  __: {
    type: 'separator',
  },

  apis: '',
  sdks: '',
  cli: '',
}

export default meta
