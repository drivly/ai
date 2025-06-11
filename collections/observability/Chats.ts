import type { ChatResource } from '@/payload.types'
import type { CollectionConfig, Condition } from 'payload'

export const ChatResources: CollectionConfig = {
  slug: 'chatResources',
  admin: {
    group: 'Observability',
    useAsTitle: 'title',
    description: 'User-generated chat content and messages',
  },
  labels: { singular: 'Chat', plural: 'Chats' },
  versions: true,
  access: {
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Chat', value: 'chat' },
        { label: 'Message', value: 'message' },
        { label: 'Document', value: 'document' },
        { label: 'Suggestion', value: 'suggestion' },
      ],
    },
    {
      name: 'content',
      type: 'text',
      required: false,
    },
    {
      name: 'parts',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Image', value: 'image' },
            { label: 'Code', value: 'code' },
            { label: 'File', value: 'file' },
          ],
        },
        {
          name: 'content',
          type: 'text',
        },
        {
          name: 'metadata',
          type: 'json',
        },
      ],
    },
    {
      name: 'parentId',
      type: 'relationship',
      relationTo: 'chatResources',
      required: false,
    },
    {
      name: 'metadata',
      type: 'json',
      required: false,
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'private',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public' },
      ],
    },
    {
      name: 'votes',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Up', value: 'up' },
            { label: 'Down', value: 'down' },
          ],
        },
        {
          name: 'createdAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      required: false,
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Code', value: 'code' },
        { label: 'Image', value: 'image' },
      ],
      admin: {
        condition: ((data) => data.resourceType === 'document') as Condition<ChatResource>,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.createdAt) {
          data.createdAt = new Date().toISOString()
        }
        data.updatedAt = new Date().toISOString()
        return data
      },
    ],
  },
}
