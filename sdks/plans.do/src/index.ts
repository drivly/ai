import type { ClientOptions, ListResponse, QueryParams } from './types.js'
import { API } from './api.js'
import { Plan, PlanStep } from '../types.js'

export * from '../types.js'

export class PlansClient {
  private api: API

  constructor(options: ClientOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://plans.do',
      apiKey: options.apiKey,
    }

    this.api = new API(apiOptions)
  }

  async find(options: QueryParams = {}): Promise<ListResponse<Plan>> {
    return this.api.list<Plan>('plans', options)
  }

  async findOne(id: string): Promise<Plan> {
    return this.api.getById<Plan>('plans', id)
  }

  async create(data: Partial<Plan>): Promise<Plan> {
    return this.api.create<Plan>('plans', data)
  }

  async update(id: string, data: Partial<Plan>): Promise<Plan> {
    return this.api.update<Plan>('plans', id, data)
  }

  async delete(id: string): Promise<Plan> {
    return this.api.remove<Plan>('plans', id)
  }

  async search(query: string, options: QueryParams = {}): Promise<ListResponse<Plan>> {
    return this.api.search<Plan>('plans', query, options)
  }

  async findSteps(planId: string, options: QueryParams = {}): Promise<ListResponse<PlanStep>> {
    return this.api.list<PlanStep>(`plans/${planId}/steps`, options)
  }

  async findOneStep(planId: string, stepId: string): Promise<PlanStep> {
    return this.api.getById<PlanStep>(`plans/${planId}/steps`, stepId)
  }

  async createStep(planId: string, data: Partial<PlanStep>): Promise<PlanStep> {
    return this.api.create<PlanStep>(`plans/${planId}/steps`, data)
  }

  async updateStep(planId: string, stepId: string, data: Partial<PlanStep>): Promise<PlanStep> {
    return this.api.update<PlanStep>(`plans/${planId}/steps`, stepId, data)
  }

  async deleteStep(planId: string, stepId: string): Promise<PlanStep> {
    return this.api.remove<PlanStep>(`plans/${planId}/steps`, stepId)
  }
}

export const plans = new PlansClient()
export default PlansClient
