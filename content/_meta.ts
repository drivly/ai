import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  overview: { title: 'Overview' },
  home: { type: 'page', title: 'Docs', href: '/docs/overview' },
  api: { type: 'page', title: 'APIs', href: '/docs/apis' },
  sdk: { type: 'page', title: 'SDKs', href: '/docs/sdks' },
  clis: { type: 'page', title: 'CLI', href: '/docs/cli' },
  pricing: { type: 'page', title: 'Pricing', href: '/pricing' },
  dashboard: { type: 'page', title: 'Dashboard', href: '/admin' },
  docs: { display: 'hidden' },
  ref: {
    type: 'page',
    title: 'Reference',
    href: 'https://reference.apis.do',
  },

  manifesto: '',
  'business-as-code': '',
  'services-as-software': '',
  primitives: '',

  // _business: {
  //   type: 'separator',
  // },

  _ai: {
    type: 'separator',
    title: 'AI',
  },
  workflows: '',
  functions: '',
  agents: '',
  services: '',

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
