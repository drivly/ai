import type { CollectionConfig } from 'payload'

export const Files: CollectionConfig = {
  slug: 'files',
  upload: {
    staticDir: 'files',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
    {
      name: 'mimeType',
      type: 'text',
      required: true,
      defaultValue: 'image/jpeg',
    },
  ],
}
