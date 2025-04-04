import type { ClientOptions, ListResponse, QueryParams } from './types.js';
import { API } from './api.js';
import { Project, Task, Resource } from '../types.js';

export * from '../types.js';

export class ProjectsClient {
  private api: API;

  constructor(options: ClientOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://projects.do',
      apiKey: options.apiKey
    };
    
    this.api = new API(apiOptions);
  }

  async find(options: QueryParams = {}): Promise<ListResponse<Project>> {
    return this.api.list<Project>('projects', options);
  }

  async findOne(id: string): Promise<Project> {
    return this.api.getById<Project>('projects', id);
  }

  async create(data: Partial<Project>): Promise<Project> {
    return this.api.create<Project>('projects', data);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return this.api.update<Project>('projects', id, data);
  }

  async delete(id: string): Promise<Project> {
    return this.api.remove<Project>('projects', id);
  }

  async search(query: string, options: QueryParams = {}): Promise<ListResponse<Project>> {
    return this.api.search<Project>('projects', query, options);
  }

  async findTasks(projectId: string, options: QueryParams = {}): Promise<ListResponse<Task>> {
    return this.api.list<Task>(`projects/${projectId}/tasks`, options);
  }

  async findOneTask(projectId: string, taskId: string): Promise<Task> {
    return this.api.getById<Task>(`projects/${projectId}/tasks`, taskId);
  }

  async createTask(projectId: string, data: Partial<Task>): Promise<Task> {
    return this.api.create<Task>(`projects/${projectId}/tasks`, data);
  }

  async updateTask(projectId: string, taskId: string, data: Partial<Task>): Promise<Task> {
    return this.api.update<Task>(`projects/${projectId}/tasks`, taskId, data);
  }

  async deleteTask(projectId: string, taskId: string): Promise<Task> {
    return this.api.remove<Task>(`projects/${projectId}/tasks`, taskId);
  }

  async findResources(options: QueryParams = {}): Promise<ListResponse<Resource>> {
    return this.api.list<Resource>('resources', options);
  }

  async findOneResource(id: string): Promise<Resource> {
    return this.api.getById<Resource>('resources', id);
  }

  async createResource(data: Partial<Resource>): Promise<Resource> {
    return this.api.create<Resource>('resources', data);
  }

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    return this.api.update<Resource>('resources', id, data);
  }

  async deleteResource(id: string): Promise<Resource> {
    return this.api.remove<Resource>('resources', id);
  }
}

export const projects = new ProjectsClient();
export default ProjectsClient;
