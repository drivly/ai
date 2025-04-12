import { CollectionConfig } from 'payload'

export const GithubTasks: CollectionConfig = {
  slug: 'githubTasks',
  admin: {
    useAsTitle: 'issueNumber',
    group: 'Integrations',
    description: 'Tasks triggered by GitHub events',
  },
  access: {
    create: () => false, // Only created by the system
    read: () => true,
  },
  fields: [
    {
      name: 'issueNumber',
      type: 'number',
      required: true,
      admin: {
        description: 'GitHub issue number',
      },
    },
    {
      name: 'repository',
      type: 'text',
      required: true,
      admin: {
        description: 'GitHub repository in owner/repo format',
      },
    },
    {
      name: 'jobId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the associated job',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'processing',
      options: [
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      admin: {
        description: 'Current status of the task',
      },
    },
  ],
  timestamps: true,
}

export default GithubTasks
