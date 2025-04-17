import { API } from 'apis.do'
import { ResearchOptions, ResearchResponse } from '../types'

export class ResearchClient {
  private api: API

  constructor(options = {}) {
    this.api = new API(options)
  }

  /**
   * Perform deep research on a topic
   * @param params Research parameters
   * @returns Research response
   */
  async research(params: ResearchOptions): Promise<ResearchResponse> {
    if (!params.topic) {
      throw new Error('Missing required parameter: topic')
    }

    return this.api.post('/research', params)
  }
}

export default ResearchClient
