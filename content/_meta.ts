import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: { title: 'Overview' },
  home: { type: 'page', title: 'Docs', href: '/docs' },
  api: { type: 'page', title: 'APIs', href: '/docs/apis' },
  sdk: { type: 'page', title: 'SDKs', href: '/docs/sdks' },
  clis: { type: 'page', title: 'CLI', href: '/docs/cli' },
  pricing: { type: 'page', title: 'Pricing', href: '/pricing' },
  dashboard: { type: 'page', title: 'Dashboard', href: '/admin' },
  docs: { display: 'hidden' },
  ref: { type: 'page', title: 'Reference', href: 'https://reference.apis.do' },

  manifesto: '',
  primitives: '',
  // 'business-as-code': '',
  // 'services-as-software': '',
  'getting-started': '',

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
  evaluations: { display: 'hidden' },
  experiments: '',
  integrations: '',
  deployment: '',
  observability: { display: 'hidden' },
  // sites: { display: 'hidden' }, // Removed as sites directory moved to repository root

  __: {
    type: 'separator',
  },

  apis: '',
  sdks: '',
  cli: '',
  // packages: { display: 'hidden' },
}

export default meta
