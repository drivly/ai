import { CollectionConfig } from 'payload'

const Config: CollectionConfig = {
  slug: 'config',
  admin: {
    useAsTitle: 'path',
    description: 'Configuration for different aspects of a project',
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
  ],
  timestamps: true,
}

export default Config
