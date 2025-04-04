import type { ClientOptions, ListResponse, QueryParams } from './types';
import { API } from './api';
import { Goal, Milestone } from '../types.js';

export * from '../types.js';

export class GoalsClient {
  private api: API;

  constructor(options: ClientOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://goals.do',
      apiKey: options.apiKey
    };
    
    this.api = new API(apiOptions);
  }

  async find(options: QueryParams = {}): Promise<ListResponse<Goal>> {
    return this.api.list<Goal>('goals', options);
  }

  async findOne(id: string): Promise<Goal> {
    return this.api.getById<Goal>('goals', id);
  }

  async create(data: Partial<Goal>): Promise<Goal> {
    return this.api.create<Goal>('goals', data);
  }

  async update(id: string, data: Partial<Goal>): Promise<Goal> {
    return this.api.update<Goal>('goals', id, data);
  }

  async delete(id: string): Promise<Goal> {
    return this.api.remove<Goal>('goals', id);
  }

  async search(query: string, options: QueryParams = {}): Promise<ListResponse<Goal>> {
    return this.api.search<Goal>('goals', query, options);
  }

  async findMilestones(goalId: string, options: QueryParams = {}): Promise<ListResponse<Milestone>> {
    return this.api.list<Milestone>(`goals/${goalId}/milestones`, options);
  }

  async findOneMilestone(goalId: string, milestoneId: string): Promise<Milestone> {
    return this.api.getById<Milestone>(`goals/${goalId}/milestones`, milestoneId);
  }

  async createMilestone(goalId: string, data: Partial<Milestone>): Promise<Milestone> {
    return this.api.create<Milestone>(`goals/${goalId}/milestones`, data);
  }

  async updateMilestone(goalId: string, milestoneId: string, data: Partial<Milestone>): Promise<Milestone> {
    return this.api.update<Milestone>(`goals/${goalId}/milestones`, milestoneId, data);
  }

  async deleteMilestone(goalId: string, milestoneId: string): Promise<Milestone> {
    return this.api.remove<Milestone>(`goals/${goalId}/milestones`, milestoneId);
  }
}

export const goals = new GoalsClient();
export default GoalsClient;
