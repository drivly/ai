import { CollectionConfig } from 'payload'

export const Config: CollectionConfig = {
  slug: 'config',
  admin: {
    useAsTitle: 'path',
    description: 'Configuration for .ai folder synchronization',
    group: 'Admin',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Relative path within .ai folder',
      },
    },
    {
      name: 'contentHash',
      type: 'text',
      required: true,
      admin: {
        description: 'SHA-256 hash of file content to detect changes',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        description: 'Project this configuration belongs to',
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Timestamp of last successful sync',
      },
    },
    {
      name: 'lastModifiedLocally',
      type: 'date',
      admin: {
        description: 'Timestamp when file was last modified locally',
      },
    },
    {
      name: 'lastModifiedRemotely',
      type: 'date',
      admin: {
        description: 'Timestamp when file was last modified in the database',
      },
    },
    {
      name: 'lastModifiedGithub',
      type: 'date',
      admin: {
        description: 'Timestamp when file was last modified in GitHub',
      },
    },
    {
      name: 'repository',
      type: 'text',
      admin: {
        description: 'GitHub repository (owner/repo) if applicable',
      },
    },
    {
      name: 'syncStatus',
      type: 'select',
      options: [
        { label: 'Synced', value: 'synced' },
        { label: 'Conflict', value: 'conflict' },
        { label: 'Pending', value: 'pending' },
      ],
      defaultValue: 'synced',
      required: true,
      admin: {
        description: 'Current sync status of the file',
      },
    },
    {
      name: 'data',
      type: 'json',
      admin: {
        description: 'Additional metadata for the file',
      },
    },
    {
      name: 'syncConfig',
      type: 'group',
      admin: {
        description: 'Sync configuration settings',
      },
      fields: [
        {
          name: 'syncMode',
          type: 'select',
          options: [
            { label: 'Database', value: 'database' },
            { label: 'Local', value: 'local' },
            { label: 'GitHub', value: 'github' },
          ],
          defaultValue: 'database',
          required: true,
          admin: {
            description: 'Source of truth for synchronization',
          },
        },
        {
          name: 'github',
          type: 'group',
          admin: {
            description: 'GitHub repository settings',
            condition: (data) => data?.syncConfig?.syncMode === 'github',
          },
          fields: [
            {
              name: 'repository',
              type: 'text',
              admin: {
                description: 'GitHub repository in owner/repo format',
              },
            },
            {
              name: 'branch',
              type: 'text',
              defaultValue: 'main',
              admin: {
                description: 'Branch to sync with',
              },
            },
            {
              name: 'createPRs',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Create PRs for changes instead of direct commits',
              },
            },
            {
              name: 'prTemplate',
              type: 'textarea',
              admin: {
                description: 'Template for PR descriptions',
                condition: (data) => data?.syncConfig?.github?.createPRs,
              },
            },
          ],
        },
        {
          name: 'trackFiles',
          type: 'array',
          admin: {
            description: 'File patterns to track for synchronization',
          },
          fields: [
            {
              name: 'pattern',
              type: 'text',
              admin: {
                description: 'File pattern (e.g., *.json, *.ts, schemas/*)',
              },
            },
          ],
          defaultValue: [{ pattern: '*.json' }, { pattern: '*.ts' }, { pattern: 'schemas/*' }],
        },
      ],
    },
  ],
  timestamps: true,
}
