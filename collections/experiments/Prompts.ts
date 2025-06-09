import { Prompt } from '@/payload.types'
import type { CollectionConfig, FieldHook } from 'payload'
import { simplerJSON } from '../../src/utils/json-fields'

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
    {
      name: 'format',
      type: 'group',
      fields: [
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
      ],
    },
    {
      name: 'agent',
      type: 'group',
      fields: [
        ...simplerJSON({
          codeFieldName: 'paramSchema',
          jsonFieldName: 'paramJsonSchema',
          defaultFormat: 'typescript',
          editorOptions: { padding: { top: 20, bottom: 20 } },
        }),
        { name: 'maxSteps', type: 'number' },
        { name: 'modelName', type: 'text' },
        ...simplerJSON({
          codeFieldName: 'schema',
          jsonFieldName: 'jsonSchema',
          defaultFormat: 'typescript',
          editorOptions: { padding: { top: 20, bottom: 20 } },
        }),
        { name: 'toolsOnly', type: 'checkbox' },
        { name: 'tools', type: 'array', fields: [{ name: 'tool', type: 'text' }] },
      ],
    },
    {
      name: 'text',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['text']
          },
        ],
        afterRead: [
          (({ data }) =>
            (data?.format
              ? `${data.name ? '# ' + data.name + '\n\n' : ''}${
                  data.format.questions?.length ? '## Questions\n\n' + data.format.questions.join('\n') + '\n\n' : ''
                }${data.format.role ? '## Role\n\n' + data.format.role + '\n\n' : ''}${
                  data.format.instructions?.length ? '## Instructions\n\n' + data.format.instructions.join('\n') + '\n\n' : ''
                }${data.format.context ? '## Context\n\n' + data.format.context + '\n\n' : ''}${
                  data.format.examples?.length
                    ? '## Examples\n\n' + data.format.examples.map((e) => `${e.title ? `### ${e.title}\n\n` : ''}${e.example}`).join('\n\n') + '\n\n'
                    : ''
                }${data.format.questions?.length ? '## Questions\n\n' + data.format.questions.join('\n') + '\n' : ''}`
              : '') + data?.system || '') as FieldHook<Prompt>,
        ],
      },
    },
  ],
}
