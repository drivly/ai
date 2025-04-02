import { API } from 'apis.do'
import { Experiment, VariantContext, VariantResult, ExperimentResults, ExperimentComparison, ExperimentRecommendation, QueryParams, ListResponse } from './types.js'
import { VercelFlagsProvider } from './provider.js'

export interface ClientOptions {
  apiKey?: string
  baseUrl?: string
  flagsApiKey?: string
  flagsBaseUrl?: string
}

export class ExperimentsClient {
  private api: API
  private flagsProvider: VercelFlagsProvider

  constructor(options: ClientOptions = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://apis.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })

    this.flagsProvider = new VercelFlagsProvider({
      apiKey: options.flagsApiKey || options.apiKey,
      baseUrl: options.flagsBaseUrl,
    })
  }

  async create(experiment: Experiment): Promise<Experiment> {
    const createdExperiment = await this.api.create<Experiment>('experiments', experiment)

    await this.flagsProvider.createFlag({
      name: experiment.name,
      description: experiment.description,
      variants: experiment.variants.reduce(
        (acc, variant) => {
          acc[variant.id] = variant.config
          return acc
        },
        {} as Record<string, any>,
      ),
      defaultVariant: experiment.variants[0].id,
    })

    return createdExperiment
  }

  async start(experimentName: string): Promise<any> {
    return this.api.post(`/api/experiments/${experimentName}/start`, {})
  }

  async getVariant(experimentName: string, context: VariantContext): Promise<VariantResult> {
    const flagResult = await this.flagsProvider.evaluateFlag(experimentName, context)

    return {
      id: flagResult.variant,
      config: flagResult.value,
    }
  }

  async recordMetrics(experimentName: string, variantId: string, metrics: Record<string, number>): Promise<any> {
    return this.flagsProvider.recordMetric(experimentName, variantId, metrics)
  }

  async getResults(experimentName: string): Promise<ExperimentResults> {
    const flagResults = await this.flagsProvider.getResults(experimentName)

    return {
      name: experimentName,
      variants: flagResults.variants,
    }
  }

  async compareVariants(experimentName: string, variantIds: string[]): Promise<ExperimentComparison> {
    return this.api.post<ExperimentComparison>(`/api/experiments/${experimentName}/compare`, {
      variants: variantIds,
    })
  }

  async getRecommendations(experimentName: string): Promise<ExperimentRecommendation> {
    return this.api.get<ExperimentRecommendation>(`/api/experiments/${experimentName}/recommendations`)
  }

  async list(params?: QueryParams): Promise<ListResponse<Experiment>> {
    return this.api.list<Experiment>('experiments', params)
  }

  async get(experimentId: string): Promise<Experiment> {
    return this.api.getById<Experiment>('experiments', experimentId)
  }

  async update(experimentId: string, data: Partial<Experiment>): Promise<Experiment> {
    return this.api.update<Experiment>('experiments', experimentId, data)
  }

  async delete(experimentId: string): Promise<any> {
    return this.api.remove<any>('experiments', experimentId)
  }
}

export default ExperimentsClient
