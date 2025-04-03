// storage-adapter-import-placeholder
// import { payloadAgentPlugin } from '@drivly/payload-agent'
// import { payloadBetterAuth } from '@payload-auth/better-auth-plugin'
import { createHooksQueuePlugin } from './pkgs/payload-hooks-queue/src'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
// import { payloadKanbanBoard } from 'payload-kanban-board'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { collections } from './collections'
import { payloadBetterAuthOptions } from './lib/auth/options'
import { tasks, workflows } from './tasks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterLogin: [
        {
          path: '@/components/auth/sign-in',
        },
      ],
      graphics: {
        Icon: '@/components/icon',
        Logo: '@/components/logo',
      },
    },
    meta: {
      title: 'Agentic Workflow Platform',
      description: 'Deliver work through simple APIs',
      titleSuffix: '| Workflows.do',
      icons: [
        {
          rel: 'icon',
          url: '/site_favicon.png',
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
  collections: collections as any,
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
    createHooksQueuePlugin({}),
    // payloadBetterAuth(payloadBetterAuthOptions),
    payloadCloudPlugin(),
    // storage-adapter-placeholder
   
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }),
  ],
})

// multiTenantPlugin<Config>({
//   tenantSelectorLabel: 'Project',
//   // tenantsArrayField: {},
//   // tenantField: {},
//   collections: {
//     functions: {},
//     workflows: {},
//     agents: {},
//   },
//   userHasAccessToAllTenants: isSuperAdmin,
// }),
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
