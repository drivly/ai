import { llm } from 'llm/llm'
import { Provider, providers } from 'providers/provider'

export const ai: Provider = {
  fetchFromProvider: async (init, method, path) => {
    if (init.body) {
      switch (path) {
        case '/v1/chat/completions':
          const response = await llm(init.body)
          return new Response(JSON.stringify(response.object), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
      }
    }
    return providers.openrouter.fetchFromProvider(init, method, path)
  },
}
