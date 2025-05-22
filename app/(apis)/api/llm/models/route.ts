import { models } from '@/pkgs/language-models'

const uniquePerField = (array: any[], field: string) => {
  // Returns all values inside an array
  // based on the field value, ensuring that only one of that field value
  // is returned.
  const unique = new Set()
  return array.filter((item) => {
    if (unique.has(item[field])) return false
    unique.add(item[field])
    return true
  })
}

export async function GET(req: Request) {
  return Response.json({
    object: 'list',
    data: uniquePerField(models, 'slug').map((model) => ({
      id: model.slug,
      object: 'model',
      created: model.createdAt,
      owned_by: model.author,
      permission: [],
    })),
  })
}
