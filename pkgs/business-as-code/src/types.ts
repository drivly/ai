export interface BusinessInterface {
  name: string
  vision: string
  objectives: Record<string, Objective>
  workflows?: Record<string, Workflow>
  agents?: Record<string, Agent>
  businessModel?: BusinessModel

  execute(): Promise<void>
  launch(): Promise<void>
  addExperiment(experiment: ExperimentInterface): void
}

export interface Objective {
  description: string
  keyResults: string[] | KeyResult[]
}

export interface KeyResult {
  description: string
  target?: number
  currentValue?: number
  unit?: string
  dueDate?: Date
}

export interface ExperimentInterface {
  name: string
  hypothesis: string
  variants: Record<string, ExperimentVariant>
  metrics: string[]
  trafficSplit: Record<string, number>
  targetObjective?: Objective

  start(): Promise<void>
  stop(): Promise<void>
  analyze(): Promise<ExperimentResults>
}

export interface ExperimentVariant {
  workflow?: Workflow | string
  agent?: Agent | string
  function?: Function | string
  configuration?: Record<string, any>
}

export interface ExperimentResults {
  variantPerformance: Record<string, VariantPerformance>
  winner?: string
  confidence?: number
  insights: string[]
}

export interface VariantPerformance {
  metrics: Record<string, number>
  sampleSize: number
}

export interface BusinessModel {
  leanCanvas?: LeanCanvasModel
  storyBrand?: StoryBrandModel
  valueProposition?: ValuePropositionModel
  revenueStreams?: RevenueStream[]
  customerSegments?: CustomerSegment[]
}

export interface LeanCanvasModel {
  problem: string[]
  solution: string[]
  uniqueValueProposition: string
  unfairAdvantage?: string
  customerSegments: string[]
  keyMetrics: string[]
  channels: string[]
  costStructure: string[]
  revenueStreams: string[]
}

export interface StoryBrandModel {
  hero: string
  problem: string
  guide: string
  plan: string[]
  callToAction: string
  failure: string
  success: string
}

export interface ValuePropositionModel {
  customerJobs: string[]
  pains: string[]
  gains: string[]
  products: string[]
  painRelievers: string[]
  gainCreators: string[]
}

export interface RevenueStream {
  name: string
  type: 'subscription' | 'transactional' | 'service' | 'product' | 'other'
  pricingModel: string
  estimatedRevenue?: number
}

export interface CustomerSegment {
  name: string
  description: string
  needs: string[]
  demographics?: Record<string, string>
  behaviors?: string[]
}

export interface Workflow {
  name: string
  steps: WorkflowStep[]
  execute(input?: any): Promise<any>
}

export interface WorkflowStep {
  name: string
  function?: Function | string
  agent?: Agent | string
  input?: Record<string, any> | ((context: any) => any)
  condition?: (context: any) => boolean
  onSuccess?: WorkflowStep | string
  onError?: WorkflowStep | string
}

export interface Function {
  name: string
  execute(input?: any): Promise<any>
}

export interface Agent {
  name: string
  execute(task: string, context?: any): Promise<any>
}
