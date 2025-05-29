import { CLI as ApisCLI } from 'apis.do/src/cli'
import { generateText, GPTOptions, GPTResponse } from './index'

interface ApiHeaders {
  Authorization?: string;
}

interface Api {
  headers?: ApiHeaders;
}

export class CLI extends ApisCLI {
  api?: Api;

  /**
   * Generate text using the GPT API
   */
  async generate(prompt: string, options: GPTOptions = {}): Promise<GPTResponse> {
    const apiKey =
      options.apiKey ||
      this.api?.headers?.Authorization?.replace('Bearer ', '');

    return generateText(prompt, { ...options, apiKey });
  }
}

export default CLI
