import { ai } from 'functions.do'
import { ResearchOptions, ResearchResponse } from '../types'

export class ResearchClient {
  private options: any

  constructor(options = {}) {
    this.options = options
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

    const result = await ai.research(params, {
      model: 'perplexity/sonar-deep-research',
      ...this.options,
    })

    return {
      success: true,
      taskId: result.taskId || '',
      jobId: result.jobId || '',
    }
  }
}

export default ResearchClient
