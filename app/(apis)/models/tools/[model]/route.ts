import { API } from '@/lib/api'
import camelcase from 'camelcase'
import { filterModels, constructModelIdentifier, getModel, models, Model, parse } from 'language-models'
import { Composio, VercelAIToolSet } from 'composio-core'
import { resolveConfig } from '@/pkgs/ai-providers/src'
import { groupByKey } from '../../utils'

const camelCaseToScreamingSnakeCase = (str: string) => {
  // When we see a capital letter, we need to prefix it with an underscore and make the whole string uppercase.
  return str
    .replaceAll('.', '_')
    .replace(/([A-Z])/g, '_$1').toUpperCase()
}

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  const originOrApiRoute = !origin.includes('models.do') ? `${origin}/models` : `${origin}/api`

  const modifyQueryString = (param: string, value: string | number, type: 'string' | 'boolean' | 'array' = 'string') => {
    const qs = new URLSearchParams(request.url.split('?')[1])
    // If the value is a boolean, and it exists, remove it
    // otherwise add it

    switch (type) {
      case 'boolean':
        if (qs.has(param)) {
          qs.delete(param)
        } else {
          qs.set(param, value.toString())
        }
        break
      case 'array':
        // arrays are serialized as a comma separated list
        // when the value exists, remove it, otherwise add it,
        // then re-serialize into a comma separated list
        let existingArray = qs.get(param)?.split(',') ?? []

        if (existingArray.includes(value.toString())) {
          existingArray = existingArray.filter((item) => item !== value.toString())
        } else {
          existingArray.push(value.toString())
        }

        qs.set(param, existingArray.join(','))

        break
      case 'string':
        qs.set(param, value.toString())
        break
    }

    // Remove any empty values but ignore models because it can be an empty string.
    qs.forEach((value, key) => {
      if (value === '' && key !== 'models') {
        qs.delete(key)
      }
    })

    return `${originOrApiRoute}?${qs.toString()}`
      .replaceAll('%3A', ':')
      .replaceAll('%2C', ',')
  }

  const qs = new URLSearchParams(request.url.split('?')[1])
  const modelName = qs.get('model') || (params.model as string) || 'gemini'

  const model = getModel(modelName)

  const resolvedConfig = await resolveConfig({
    model: modelName,
    user: user.email || 'connor@driv.ly'
  })

  const parsed = parse(modelName)

  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })
  const connections = await composio.connectedAccounts.list({
    user_uuid: user.email || 'connor@driv.ly'
  })
  
  const composioToolset = new VercelAIToolSet({
    apiKey: process.env.COMPOSIO_API_KEY,
    connectedAccountIds: connections.items
      .map(connection => [connection.appName, connection.id])
      .reduce((acc, [app, id]) => ({ ...acc, [app]: id }), {})
  })
  
  const tools = await composioToolset.getTools({
    apps: connections.items.map(conn => conn.appName),
    //actions: toolNames.map(name => camelCaseToScreamingSnakeCase(name)),
  })

  const formatToolName = (name: string) => {
    // First _ is the app name, second _ is the action name
    const [app, ...action] = name.split('_')
    return `${app.toLowerCase()}.${camelcase(action.join(' '))}`
  }

  const addToolToModel = (name: string) => {
    const toolName = name.includes('.') ? name : formatToolName(name)
    
    const tools = { ...(model.parsed.tools ?? {}) }

    if (tools[toolName]) {
      delete tools[toolName]
    } else {
      tools[toolName] = true
    }

    const newModelIdentifier = constructModelIdentifier({
      ...model.parsed,
      tools,
    })

    return `${originOrApiRoute}/tools/${newModelIdentifier}?${qs.toString()}`
      .replaceAll('(', '%28')
      .replaceAll(')', '%29')
  }

  const allTools = Object.entries(tools).map(([name, tool]) => {
    return { name: formatToolName(name), app: name.split('_')[0].toLowerCase(), url: addToolToModel(name) }
  })

  const groupedToolsByApp = Object.entries(groupByKey(allTools, ({ app }) => app))

  return {
    links: {
      models: modifyQueryString('model', modelName, 'string'),
    },
    activeTools: Object.keys(parsed.tools ?? {}).map(name => ({ name, url: addToolToModel(name) })).reduce((acc, tool) => {
      acc[tool.name] = tool.url
      return acc
    }, {} as Record<string, string>),
    allTools: groupedToolsByApp.map(([app, tools]) => {
      return {
        app,
        tools: tools.reduce((acc, tool) => {
          acc[tool.name] = tool.url
          return acc
        }, {} as Record<string, string>)
      }
    }).reduce((acc, { app, tools }) => {
      acc[app] = tools
      return acc
    }, {} as Record<string, Record<string, string>>),
  }
})
