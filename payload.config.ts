// storage-adapter-import-placeholder
// import { payloadAgentPlugin } from '@drivly/payload-agent'
// import { betterAuthPlugin } from '@drivly/better-payload-auth/plugin'
import { openapi } from 'payload-oapi'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { createHooksQueuePlugin } from 'payload-hooks-queue'
// import workosPlugin from './pkgs/payload-workos'
import path from 'path'
import { buildConfig } from 'payload'
// import { payloadKanbanBoard } from 'payload-kanban-board'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { collections } from './collections'
import { tasks, workflows } from './tasks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // user: 'users',

    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(admin)/admin/importMap.js'),
    },
    components: {
      // afterLogin: [
      //   {
      //     path: '@/components/auth/sign-in',
      //   },
      // ],
      graphics: {
        Icon: '@/components/admin/icon',
        Logo: '@/components/admin/logo',
      },
      logout: {
        Button: '@/components/admin/custom-logout-button',
      },
    },
    meta: {
      title: 'Agentic Workflow Platform',
      description: 'Deliver work through simple APIs',
      titleSuffix: '| Workflows.do',
      icons: [
        {
          rel: 'icon',
          url: '/favicon/faviconDo.png',
        },
      ],
      openGraph: {
        title: 'Agentic Workflow Platform | Workflows.do',
        description: 'Deliver work through simple APIs',
        images: [
          {
            url: '/Github_Banner_5.png',
            width: 800,
            height: 600,
          },
        ],
        siteName: 'apis.do',
      },
    },
  },
  collections: collections,
  editor: lexicalEditor(),
  email: resendAdapter({
    defaultFromAddress: process.env.DEFAULT_FROM_ADDRESS || '',
    defaultFromName: process.env.DEFAULT_FROM_NAME || '',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload.types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  jobs: {
    addParentToTaskLog: true,
    tasks,
    workflows,
    access: {
      run: ({ req }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
  },
  sharp,
  plugins: [
    // payloadAgentPlugin({
    //   aiAvatar: '/ai.webp',
    //   defaultMessage: "I'm the AI assistant for Workflows.do. Ask me anything about the platform.",
    //   direction: 'horizontal',
    //   type: 'resizable',
    //   logo: '/DrivlyLogo.svg',
    //   // suggestions: suggestedActions,
    // }),
    // betterAuthPlugin(payloadBetterAuthOptions),
    payloadCloudPlugin(),
    openapi({
      metadata: {
        title: 'Workflows.do API',
        description: 'API documentation for Workflows.do',
        version: '1.0.0',
      },
      specEndpoint: '/v1/docs/openapi.json',
    }),
    // storage-adapter-placeholder

    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }),
    createHooksQueuePlugin({
      'nouns.beforeChange': 'inflectNouns',
      'nouns.afterChange': 'inflectNouns',
      'verbs.beforeChange': 'conjugateVerbs',
      'verbs.afterChange': 'conjugateVerbs',
      'functions.afterChange': ['processCodeFunction', 'generateFunctionExamples'],
      'searches.beforeChange': 'generateEmbedding',
      'searches.afterChange': ['searchThings', 'hybridSearchThings'],
      'actions.afterChange': 'executeFunction',
      'events.afterChange': 'deliverWebhook',
      'tasks.afterChange': ['syncTaskToLinear'],
      'tasks.afterDelete': ['deleteLinearIssue'],
    }),
    multiTenantPlugin({
      tenantSelectorLabel: 'Project',
      collections: {
        functions: {},
        workflows: {},
        agents: {},

        queues: {},
        tasks: {},
        goals: {},
        kpis: {},

        nouns: {},
        verbs: {},
        databases: {},
        resources: {},
        chatResources: {},

        integrations: {},
        connectAccounts: {},
        connections: {},
        integrationTriggers: {},
        integrationActions: {},
        integrationCategories: {},

        triggers: {},
        searches: {},

        experiments: {},
        models: {},
        prompts: {},
        settings: {},

        types: {},
        modules: {},
        packages: {},
        deployments: {},

        benchmarks: {},
        evals: {},
        evalRuns: {},
        evalResults: {},
        datasets: {},

        events: {},
        errors: {},
        generations: {},
        traces: {},
      },
      tenantsSlug: 'projects',
      userHasAccessToAllTenants: (user) => {
        if (!user) return false

        if (user.roles?.some((role: any) => typeof role === 'object' && role.superAdmin)) {
          return true
        }

        const email = user.email
        if (!email) return false
        return email.endsWith('@driv.ly')
      },
    }),
    // workosPlugin({
    //   apiKey: process.env.WORKOS_API_KEY,
    //   clientId: process.env.WORKOS_CLIENT_ID,
    //   redirectUri: process.env.WORKOS_REDIRECT_URI,
    //   features: {
    //     sso: true,
    //     directorySync: true,
    //     mfa: true,
    //     adminPortal: true,
    //     magicAuth: true,
    //     secrets: true,
    //     webhooks: true,
    //   },
    // }),
  ],
})

// payloadKanbanBoard({
//   collections: {
//     tasks: {
//       enabled: true,
//       config: {
//         statuses: [
//           {
//             value: 'draft',
//             label: 'Draft',
//           },
//           { value: 'in-progress', label: 'In Progress' },
//           {
//             value: 'ready-for-review',
//             label: 'Ready for review',
//             dropValidation: ({ user, data }) => {
//               return { dropAble: false }
//               //<dropValidation key is optional>
//             },
//           },
//           { value: 'published', label: 'Published' },
//         ],

//         defaultStatus: 'todo',
//         // hideNoStatusColumn: true,
//       },
//     },
//   },
// })
