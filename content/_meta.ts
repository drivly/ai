import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  docs: { type: 'page', href: '/docs' },
  api: { type: 'page', title: 'APIs', href: '/docs/apis' },
  sdk: { type: 'page', title: 'SDKs', href: '/docs/sdks' },
  dashboard: { type: 'page', href: '/admin' },
  reference: { type: 'page', href: 'https://docs.apis.do' },

  manifesto: '',
  primitives: '',
  
  _ai: {
    type: 'separator',
    title: 'AI',
  },
  workflows: '',
  functions: '',
  agents: '',

  _: {
    type: 'separator',
  },

  business: '',
  data: '',
  events: '',
  experiments: '',
  integrations: '',
  deployment: '',
  observability: '',
  

  __: {
    type: 'separator',
  },




  

}

export default meta
