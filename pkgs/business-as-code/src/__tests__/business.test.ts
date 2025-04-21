import { describe, it, expect } from 'vitest'
import { Business, Experiment } from '../index'

describe('Business-as-Code Package', () => {
  describe('Business Constructor', () => {
    it('should create a business instance with basic properties', () => {
      const business = Business({
        name: 'TechInnovators',
        vision: 'Democratize AI for small businesses',
        objectives: {
          customerSuccess: {
            description: 'Create delighted customers who achieve their goals',
            keyResults: [
              'Achieve 95% customer satisfaction score by Q4',
              'Reduce average support ticket resolution time by 30% within 6 months',
              'Increase customer retention rate to 85% year-over-year',
            ],
          },
        },
      })

      expect(business).toBeDefined()
      expect(business.name).toBe('TechInnovators')
      expect(business.vision).toBe('Democratize AI for small businesses')
      expect(business.objectives.customerSuccess).toBeDefined()
      expect(business.execute).toBeInstanceOf(Function)
      expect(business.launch).toBeInstanceOf(Function)
      expect(business.addExperiment).toBeInstanceOf(Function)
    })
  })

  describe('Experiment Constructor', () => {
    it('should create an experiment instance with basic properties', () => {
      const experiment = Experiment({
        name: 'Onboarding Flow Test',
        hypothesis: 'A simplified onboarding flow will increase signup conversion rate.',
        variants: {
          control: {
            workflow: 'standardOnboardingWorkflow',
          },
          simplified: {
            workflow: 'simplifiedOnboardingWorkflow',
          },
        },
        metrics: ['signupConversionRate', 'timeToSignup'],
        trafficSplit: { control: 0.5, simplified: 0.5 },
      })

      expect(experiment).toBeDefined()
      expect(experiment.name).toBe('Onboarding Flow Test')
      expect(experiment.hypothesis).toBe('A simplified onboarding flow will increase signup conversion rate.')
      expect(experiment.variants.control).toBeDefined()
      expect(experiment.variants.simplified).toBeDefined()
      expect(experiment.start).toBeInstanceOf(Function)
      expect(experiment.stop).toBeInstanceOf(Function)
      expect(experiment.analyze).toBeInstanceOf(Function)
    })
  })
})
