// Returns a model's author icon
import { getModel } from '@/pkgs/language-models'
import { NextRequest, NextResponse } from 'next/server'

const getModelIcon = async (modelName: string): Promise<string> => {
  const model = await getModel(modelName)

  const modelAuthor = model.author

  const html = await fetch(`https://openrouter.ai/${modelAuthor}`).then(res => res.text())

  return 'https://openrouter.ai/images/icons/' + html
    .split('/images/icons/')[1]
    .split('\\"')[0]
}

export const GET = async (req: NextRequest, { params }: { params: Promise<Record<string, string | string[]>> }) => {
  const { modelName } = await params

  const icon = await fetch(await getModelIcon(modelName as string))

  return new Response(icon.body, {
    headers: {
      'Content-Type': icon.headers.get('Content-Type') as string
    }
  })
}
