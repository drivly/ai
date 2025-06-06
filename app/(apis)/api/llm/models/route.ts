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
  const { searchParams } = new URL(req.url)
  
  const filters: ((model: any) => boolean)[] = []

  for (const [key, value] of searchParams.entries()) {
    filters.push((model) => model[key]?.toLowerCase()?.includes(String(value).toLowerCase()))
  }

  return Response.json({
    object: 'list',
    data: uniquePerField(models, 'slug')
    .filter((model) => filters.every((filter) => filter(model)))
    .map((model) => ({
      id: model.slug,
      object: 'model',
      created: model.createdAt,
      owned_by: model.author,
      permission: [],
      metadata: model
    })),
  })
}
