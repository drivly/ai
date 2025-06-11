import { Prompt } from '@/payload.types'
import type { CollectionConfig, FieldHook } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Manages prompt templates for AI model interactions',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'system', type: 'text' },
    { name: 'modelName', type: 'text' },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          options: ['system', 'user', 'assistant', 'tool'],
          defaultValue: 'user',
          required: true,
        },
        { name: 'contentString', type: 'text' },
        {
          name: 'contentArray',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: ['text', 'image', 'file', 'tool_call', 'tool_result', 'reasoning', 'redacted_reasoning'],
              required: true,
              defaultValue: 'text',
            },
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'imageString',
              type: 'text',
            },
            {
              name: 'imageFile',
              type: 'upload',
              relationTo: 'files',
            },
            { name: 'dataString', type: 'text' },
            { name: 'dataFile', type: 'upload', relationTo: 'files' },
            { name: 'filename', type: 'text' },
            { name: 'mimeType', type: 'text' },
            { name: 'signature', type: 'text' },
            { name: 'data', type: 'text' },
            {
              name: 'toolCallId',
              type: 'text',
            },
            {
              name: 'toolName',
              type: 'text',
            },
            {
              name: 'args',
              type: 'json',
            },
            {
              name: 'result',
              type: 'json',
            },
            {
              name: 'isError',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
    { name: 'questions', type: 'array', fields: [{ name: 'question', type: 'text' }] },
    { name: 'role', type: 'text' },
    { name: 'instructions', type: 'array', fields: [{ name: 'instruction', type: 'text' }] },
    { name: 'context', type: 'text' },
    {
      name: 'examples',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'example', type: 'text', required: true },
      ],
    },
    {
      name: 'paramJsonSchema',
      type: 'code',
      admin: {
        language: 'json',
      },
    },
    { name: 'maxSteps', type: 'number' },
    {
      name: 'jsonSchema',
      type: 'code',
      admin: {
        language: 'typescript',
      },
    },
    { name: 'tools', type: 'array', fields: [{ name: 'tool', type: 'text' }] },
    { name: 'toolsOnly', type: 'checkbox' },
    {
      name: 'text',
      type: 'code',
      admin: {
        language: 'markdown',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['text']
          },
        ],
        afterRead: [
          (({ data }) =>
            (data
              ? `${data.name ? '# ' + data.name + '\n\n' : ''}${
                  data.questions?.length ? '## Questions\n\n' + data.questions.map((q) => q.question).join('\n') + '\n\n' : ''
                }${data.role ? '## Role\n\n' + data.role + '\n\n' : ''}${
                  data.instructions?.length ? '## Instructions\n\n' + data.instructions.map((i) => i.instruction).join('\n') + '\n\n' : ''
                }${data.context ? '## Context\n\n' + data.context + '\n\n' : ''}${
                  data.examples?.length ? '## Examples\n\n' + data.examples.map((e) => `${e.title ? `### ${e.title}\n\n` : ''}${e.example}`).join('\n\n') + '\n\n' : ''
                }${data.questions?.length ? '## Questions\n\n' + data.questions.map((q) => q.question).join('\n') + '\n' : ''}`
              : '') + (data?.system || '')) as FieldHook<Prompt>,
        ],
      },
    },
  ],
}
