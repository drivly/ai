import { API } from './api.js'
import type { ClientOptions, GoalsInput, GoalsInstance, Goal, KeyResult, ListResponse, Milestone, QueryParams } from './types.js'

export * from './types.js'

/**
 * GoalsClient provides traditional CRUD operations for goals
 */
export class GoalsClient {
  private api: API

  constructor(options: ClientOptions = {}) {
    const apiOptions: ClientOptions = {
      baseUrl: options.baseUrl || 'https://goals.do',
      apiKey: options.apiKey,
    }

    this.api = new API(apiOptions)
  }

  async find(options: QueryParams = {}): Promise<ListResponse<Goal>> {
    return this.api.list<Goal>('goals', options)
  }

  async findOne(id: string): Promise<Goal> {
    return this.api.getById<Goal>('goals', id)
  }

  async create(data: Partial<Goal>): Promise<Goal> {
    return this.api.create<Goal>('goals', data)
  }

  async update(id: string, data: Partial<Goal>): Promise<Goal> {
    return this.api.update<Goal>('goals', id, data)
  }

  async delete(id: string): Promise<Goal> {
    return this.api.remove<Goal>('goals', id)
  }

  async search(query: string, options: QueryParams = {}): Promise<ListResponse<Goal>> {
    return this.api.search<Goal>('goals', query, options)
  }

  async findMilestones(goalId: string, options: QueryParams = {}): Promise<ListResponse<Milestone>> {
    return this.api.list<Milestone>(`goals/${goalId}/milestones`, options)
  }

  async findOneMilestone(goalId: string, milestoneId: string): Promise<Milestone> {
    return this.api.getById<Milestone>(`goals/${goalId}/milestones`, milestoneId)
  }

  async createMilestone(goalId: string, data: Partial<Milestone>): Promise<Milestone> {
    return this.api.create<Milestone>(`goals/${goalId}/milestones`, data)
  }

  async updateMilestone(goalId: string, milestoneId: string, data: Partial<Milestone>): Promise<Milestone> {
    return this.api.update<Milestone>(`goals/${goalId}/milestones`, milestoneId, data)
  }

  async deleteMilestone(goalId: string, milestoneId: string): Promise<Milestone> {
    return this.api.remove<Milestone>(`goals/${goalId}/milestones`, milestoneId)
  }
}

/**
 * Goals function provides a concise syntax for defining OKRs
 *
 * @example
 * ```typescript
 * const companyGoals = Goals({
 *   customerSuccess: {
 *     description: 'Create delighted customers who achieve their goals',
 *     keyResults: [
 *       'Achieve 95% customer satisfaction score by Q4',
 *       {
 *         description: 'Increase customer retention rate to 85%',
 *         target: 85,
 *         currentValue: 72,
 *         unit: '%'
 *       }
 *     ]
 *   }
 * })
 * ```
 */
export function Goals(input: GoalsInput, options: ClientOptions = {}): GoalsInstance {
  const client = new GoalsClient(options)
  let goalIds: Record<string, string> = {}

  return {
    /**
     * Save goals to the database
     */
    async save(): Promise<Record<string, Goal>> {
      const savedGoals: Record<string, Goal> = {}

      for (const [key, objective] of Object.entries(input)) {
        const goal = await client.create({
          name: key,
          description: objective.description,
        })

        goalIds[key] = goal.id
        savedGoals[key] = goal

        for (const keyResult of objective.keyResults) {
          if (typeof keyResult === 'string') {
            await client.createMilestone(goal.id, {
              name: keyResult,
              description: keyResult,
            })
          } else {
            await client.createMilestone(goal.id, {
              name: keyResult.description,
              description: keyResult.description,
            })
          }
        }
      }

      return savedGoals
    },

    /**
     * Update progress for a specific key result
     */
    async updateProgress(objectiveKey: string, keyResult: string | number, progress: number): Promise<void> {
      const goalId = goalIds[objectiveKey]
      if (!goalId) {
        throw new Error(`Objective "${objectiveKey}" not found. Did you call save() first?`)
      }

      const { docs: milestones } = await client.findMilestones(goalId)

      let milestone
      if (typeof keyResult === 'number') {
        if (keyResult < 0 || keyResult >= milestones.length) {
          throw new Error(`Invalid key result index: ${keyResult}`)
        }
        milestone = milestones[keyResult]
      } else {
        milestone = milestones.find((m) => m.name === keyResult || m.description === keyResult)
        if (!milestone) {
          throw new Error(`Key result "${keyResult}" not found for objective "${objectiveKey}"`)
        }
      }

      await client.updateMilestone(goalId, milestone.id, {
        ...milestone,
        progress,
      })
    },

    /**
     * Get current progress for all objectives and key results
     */
    async getProgress(): Promise<Record<string, { progress: number; keyResults: Record<string, number> }>> {
      const progress: Record<string, { progress: number; keyResults: Record<string, number> }> = {}

      for (const [key, goalId] of Object.entries(goalIds)) {
        const { docs: milestones } = await client.findMilestones(goalId)
        const keyResultsProgress: Record<string, number> = {}

        let totalProgress = 0
        for (const milestone of milestones) {
          const milestoneProgress = milestone.progress || 0
          keyResultsProgress[milestone.name || ''] = milestoneProgress
          totalProgress += milestoneProgress
        }

        const avgProgress = milestones.length > 0 ? totalProgress / milestones.length : 0

        progress[key] = {
          progress: avgProgress,
          keyResults: keyResultsProgress,
        }
      }

      return progress
    },

    /**
     * Convert goals to JSON
     */
    toJSON(): GoalsInput {
      return { ...input }
    },
  }
}

export const goals = new GoalsClient()
export default GoalsClient
