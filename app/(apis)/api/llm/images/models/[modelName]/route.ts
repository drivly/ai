// Returns a model's author icon
import { getModel } from '@/pkgs/language-models'
import { NextRequest } from 'next/server'

const getModelIcon = async (modelName: string): Promise<string> => {
  const model = await getModel(modelName)
  // @ts-expect-error - TODO Fix types.
  return model.authorIcon
}

export const GET = async (req: NextRequest, { params }: { params: Promise<Record<string, string | string[]>> }) => {
  const { modelName } = await params

  const icon = await fetch(await getModelIcon(modelName as string))

  return new Response(icon.body, {
    headers: {
      'Content-Type': icon.headers.get('Content-Type') as string,
      'Cache-Control': 'public, max-age=31536000, immutable',
      Expires: new Date(Date.now() + 31536000).toUTCString(),
      Vary: 'Accept-Encoding',
      ETag: icon.headers.get('ETag') as string,
    },
  })
}
