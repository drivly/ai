import { BusinessInterface, Objective, ExperimentInterface, Workflow, Agent, BusinessModel } from './types'

/**
 * Creates a new Business instance
 */
export function Business(config: Omit<BusinessInterface, 'execute' | 'launch' | 'addExperiment'>): BusinessInterface {
  const experiments: ExperimentInterface[] = []
  const state = {
    isLaunched: false,
    isExecuting: false,
    metrics: {} as Record<string, number>,
  }

  const business: BusinessInterface = {
    ...config,

    addExperiment(experiment: ExperimentInterface): void {
      experiments.push(experiment)
    },

    async launch(): Promise<void> {
      if (state.isLaunched) {
        return
      }

      if (business.workflows) {
        for (const workflowKey in business.workflows) {
          const workflow = business.workflows[workflowKey]
        }
      }

      if (business.agents) {
        for (const agentKey in business.agents) {
          const agent = business.agents[agentKey]
        }
      }

      state.isLaunched = true
    },

    async execute(): Promise<void> {
      if (state.isExecuting) {
        return
      }

      if (!state.isLaunched) {
        await business.launch()
      }

      state.isExecuting = true

      try {
        if (business.workflows) {
          for (const workflowKey in business.workflows) {
            const workflow = business.workflows[workflowKey]
            await workflow.execute()
          }
        }

        for (const experiment of experiments) {
          await experiment.start()
        }
      } finally {
        state.isExecuting = false
      }
    },
  }

  return business
}
