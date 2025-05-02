// Returns the tool icon for a given tool name
import { API } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

type ToolIcon = {
  name: string
  icon: string
}

export const getToolIcon = async (toolName: string): Promise<string> => {
  const internalTools = [
    'fetchWebsiteContents',
    'worker',
    'testTool'
  ]

  if (internalTools.includes(toolName)) {
    return 'https://workflows.do/apple-icon.png'
  }

  const toolMetadata = await fetch(
    `http://prodthermospubliclb-2130399048.us-east-1.elb.amazonaws.com/api/actions/${toolName}`,
    {
      headers: {
        'x-api-key': process.env.COMPOSIO_API_KEY as string
      }
    }
  ).then(res => res.json())

  return toolMetadata.logo
}

export const GET = async (req: NextRequest, { params }: { params: Promise<Record<string, string | string[]>> }) => {
  const { toolName } = await params

  const icon = await fetch(await getToolIcon(toolName as string))

  return new Response(icon.body, {
    headers: {
      'Content-Type': icon.headers.get('Content-Type') as string
    }
  })
}