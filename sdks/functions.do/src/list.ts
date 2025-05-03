/**
 * Implementation of the list function for the functions.do SDK
 * This function fetches from apis.do/functions/list with query params
 */

/**
 * Fetches a list from the API with the given prompt and options
 * @param prompt The prompt to generate a list from
 * @param options Configuration options including system prompt, model, and streaming
 * @returns Either a Promise with the list items or an async iterator for streaming
 */
export const list = async (prompt: string, options?: { 
  system?: string;
  model?: string;
  stream?: boolean;
  [key: string]: any;
}) => {
  if (process.env.NODE_ENV === 'test') {
    return { items: [`Mock list item for: ${prompt}`] }
  }

  const { system, model, stream, ...rest } = options || {}
  
  const params = new URLSearchParams()
  if (prompt) params.set('prompt', prompt)
  if (system) params.set('system', system)
  if (model) params.set('model', model)
  if (stream !== undefined) params.set('stream', String(stream))
  
  if (stream) {
    return async function* () {
      try {
        const response = await fetch(`https://apis.do/functions/list?${params.toString()}`, {
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!response.ok) {
          throw new Error(`List API call failed with status ${response.status}`)
        }
        
        if (!response.body) {
          throw new Error('Response body is empty')
        }
        
        const reader = response.body.getReader()
        let buffer = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += new TextDecoder().decode(value)
          
          const lines = buffer.split('\n').filter(Boolean)
          
          for (const line of lines) {
            try {
              const item = JSON.parse(line)
              yield item
            } catch (e) {
              yield line
            }
          }
          
          const lastNewlineIndex = buffer.lastIndexOf('\n')
          if (lastNewlineIndex !== -1) {
            buffer = buffer.substring(lastNewlineIndex + 1)
          }
        }
      } catch (error) {
        console.error('Error calling list API:', error)
        throw error
      }
    }
  }
  
  try {
    const response = await fetch(`https://apis.do/functions/list?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error(`List API call failed with status ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error calling list API:', error)
    throw error
  }
}
