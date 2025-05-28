import { CLI as ApisCLI } from 'apis.do/src/cli'
import { generateText, GPTOptions, GPTResponse } from './index'

export class CLI extends ApisCLI {
  /**
   * Generate text using the GPT API
   */
  async generate(prompt: string, options: GPTOptions = {}): Promise<GPTResponse> {
    const apiKey =
      options.apiKey ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).api?.headers?.Authorization?.replace('Bearer ', '')

    return generateText(prompt, { ...options, apiKey })
  }
}

export default CLI
