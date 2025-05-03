import { API, client } from 'apis.do'
import { Experiment, VariantContext, VariantResult, ExperimentResults, ExperimentComparison, ExperimentRecommendation, QueryParams, ListResponse, ClientOptions } from './types.js'
import { VercelFlagsProvider, EvaluationContext } from './provider.js'

export interface ExperimentsClientOptions extends ClientOptions {
  flagsApiKey?: string
  flagsBaseUrl?: string
  analyticsEnabled?: boolean
  baseUrl?: string
  apiKey?: string
}

export class ExperimentsClient {
  private api: API
  private flagsProvider: VercelFlagsProvider
  private analyticsEnabled: boolean

  constructor(options: ExperimentsClientOptions = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://apis.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      ignoreSSLErrors: process.env.NODE_ENV === 'test' || process.env.VITEST === 'true',
    })

    this.flagsProvider = new VercelFlagsProvider({
      apiKey: options.flagsApiKey || options.apiKey,
      baseUrl: options.flagsBaseUrl,
    })

    this.analyticsEnabled = options.analyticsEnabled ?? true

    this.flagsProvider.initialize().catch((err) => console.error('Failed to initialize flags provider:', err))
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
      defaultVariant: experiment.variants.find((v) => v.isControl)?.id || experiment.variants[0].id,
    })

    return createdExperiment
  }

  async start(experimentName: string): Promise<any> {
    return this.api.post(`/v1/experiments/${experimentName}/start`, {})
  }

  async getVariant(experimentName: string, context: VariantContext): Promise<VariantResult> {
    const evaluationContext: EvaluationContext = {
      ...context,
    }

    const defaultValue = {}
    const resolution = await this.flagsProvider.resolveObjectEvaluation(experimentName, defaultValue, evaluationContext)

    return {
      id: resolution.variant || 'default',
      config: resolution.value || defaultValue,
    }
  }

  async track(experimentName: string, variantId: string, metrics: Record<string, number>, context?: VariantContext): Promise<any> {
    const flagsResult = await this.flagsProvider.recordMetric(experimentName, variantId, metrics)

    if (this.analyticsEnabled) {
      const metricEntries = Object.entries(metrics).map(([name, value]) => ({
        experimentId: experimentName,
        variantId,
        metricName: name,
        value,
        userId: context?.userId,
        sessionId: context?.sessionId,
        metadata: context || {},
      }))

      await Promise.all(metricEntries.map((entry) => this.api.create('experiment-metrics', entry)))
    }

    return flagsResult
  }

  async trackEvent(experimentName: string, variantId: string, eventName: string, properties?: Record<string, any>, context?: VariantContext): Promise<any> {
    if (!this.analyticsEnabled) {
      return null
    }

    if (typeof window !== 'undefined' && 'va' in window) {
      const va = (window as any).va
      if (typeof va === 'function') {
        va('event', {
          name: eventName,
          experimentName,
          variantId,
          ...properties,
        })
      }
    }

    return this.api.create('experiment-metrics', {
      experimentId: experimentName,
      variantId,
      metricName: eventName,
      value: 1, // Default value for events
      userId: context?.userId,
      sessionId: context?.sessionId,
      metadata: {
        ...properties,
        ...context,
      },
    })
  }

  async getResults(experimentName: string): Promise<ExperimentResults> {
    const flagResults = await this.flagsProvider.getResults(experimentName)

    return {
      name: experimentName,
      variants: flagResults.variants,
    }
  }

  async compareVariants(experimentName: string, variantIds: string[]): Promise<ExperimentComparison> {
    return this.api.post<ExperimentComparison>(`/v1/experiments/${experimentName}/compare`, {
      variants: variantIds,
    })
  }

  async getRecommendations(experimentName: string): Promise<ExperimentRecommendation> {
    return this.api.get<ExperimentRecommendation>(`/v1/experiments/${experimentName}/recommendations`)
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
