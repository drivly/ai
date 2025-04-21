[![npm version](https://img.shields.io/npm/v/ai-business.svg)](https://www.npmjs.com/package/ai-business)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)

# ai-business

> AI-powered business primitives for representing and operating business concepts as code

## Overview

The `ai-business` package provides the foundational primitives for representing business concepts like Objectives and Key Results (OKRs) as code structures with AI operation capabilities. It serves as an underlying primitive for the [`business-as-code`](https://www.npmjs.com/package/business-as-code) package, enabling AI-powered monitoring, analysis, and strategy recommendations for business objectives.

This package bridges the gap between static business definitions and dynamic AI-powered operations, allowing businesses to not only define their goals in code but also leverage AI to monitor progress, gain insights, and adapt strategies.

## Key Features

- **AI-Enhanced OKRs**: Define objectives and key results with built-in AI operation capabilities
- **Automated Monitoring**: Schedule regular analysis of business objectives and key results
- **Strategy Recommendations**: Receive AI-powered suggestions for strategy adjustments
- **Integration Capabilities**: Connect with external OKR systems, task management tools, and communication channels
- **Extensible Architecture**: Build custom AI operations on top of the core primitives

## Installation

```bash
npm install ai-business
# or
pnpm add ai-business
# or
yarn add ai-business
```

## Usage

### Basic Example

```typescript
import { createAiBusinessOperator, Objective } from 'ai-business'

// Create an AI business operator
const aiOperator = createAiBusinessOperator()

// Define an objective with key results
const objective: Objective = {
  id: 'obj-001',
  name: 'Increase Customer Satisfaction',
  description: 'Improve overall customer experience and satisfaction metrics',
  keyResults: [
    {
      id: 'kr-001',
      description: 'Achieve NPS score of 50+',
      targetValue: 50,
      currentValue: 42,
      unit: 'points',
    },
    {
      id: 'kr-002',
      description: 'Reduce customer support response time',
      targetValue: 2,
      currentValue: 4.5,
      unit: 'hours',
    },
  ],
  aiOperations: {
    autoMonitor: true,
    analysisFrequency: 'weekly',
  },
}

// Monitor the objective
async function monitorBusinessObjective() {
  const analysis = await aiOperator.monitorObjective(objective)
  console.log('Objective Status:', analysis.status)
  console.log('Insights:', analysis.insights)

  // Get strategy recommendations
  const recommendations = await aiOperator.suggestStrategyAdjustments(objective, analysis)
  console.log('Strategy Recommendations:', recommendations)
}

monitorBusinessObjective()
```

### Integration with External Systems

```typescript
import { createAiBusinessOperator, createBusinessIntegrations, Objective } from 'ai-business'

const aiOperator = createAiBusinessOperator()
const integrations = createBusinessIntegrations()

async function analyzeAndPublish(objective: Objective) {
  // Analyze the objective
  const analysis = await aiOperator.monitorObjective(objective)

  // Publish results to relevant channels
  await integrations.publishAnalysisResults(objective, analysis, ['slack', 'dashboard'])

  // Get strategy recommendations
  const recommendations = await aiOperator.suggestStrategyAdjustments(objective, analysis)

  // Create tasks from recommendations
  await integrations.createTasksFromRecommendations(recommendations, 'github')
}
```

### Integration with business-as-code

The `ai-business` package is designed to work seamlessly with the `business-as-code` package:

```typescript
import { Business } from 'business-as-code'
import { createAiBusinessOperator, Objective } from 'ai-business'

// Create an AI business operator
const aiOperator = createAiBusinessOperator()

// Define a business using business-as-code
const myBusiness = Business({
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

// Convert business-as-code objectives to ai-business objectives
const aiObjectives: Objective[] = Object.entries(myBusiness.objectives).map(([id, obj]) => ({
  id,
  name: id,
  description: obj.description,
  keyResults: Array.isArray(obj.keyResults)
    ? obj.keyResults.map((kr, idx) => ({
        id: `${id}-kr-${idx}`,
        description: typeof kr === 'string' ? kr : kr.description,
        targetValue: typeof kr === 'string' ? 100 : kr.target || 100,
        currentValue: typeof kr === 'string' ? 0 : kr.currentValue || 0,
        unit: typeof kr === 'string' ? '%' : kr.unit || '%',
      }))
    : [],
  aiOperations: {
    autoMonitor: true,
    analysisFrequency: 'weekly',
  },
}))

// Monitor all objectives
async function monitorAllObjectives() {
  for (const objective of aiObjectives) {
    const analysis = await aiOperator.monitorObjective(objective)
    console.log(`Objective ${objective.name} status: ${analysis.status}`)
  }
}
```

## Core Interfaces

### Objective

Represents a business objective with associated key results and AI operation configuration.

```typescript
interface Objective {
  id: string
  name: string
  description: string
  keyResults: KeyResult[]
  aiOperations?: AiOperationConfig
}
```

### KeyResult

Represents a measurable outcome that indicates progress toward an objective.

```typescript
interface KeyResult {
  id: string
  description: string
  targetValue: number
  currentValue: number
  unit?: string
  aiOperations?: AiOperationConfig
}
```

### AiOperationConfig

Configuration for AI operations on objectives and key results.

```typescript
interface AiOperationConfig {
  autoMonitor?: boolean
  adaptStrategy?: boolean
  analysisFrequency?: 'daily' | 'weekly' | 'monthly'
}
```

## Core Classes

### AiBusinessOperator

Provides AI-powered operations for business objectives and key results.

```typescript
class AiBusinessOperator {
  constructor(config?: AiBusinessOperatorConfig)

  // Monitor an objective and analyze its current status
  async monitorObjective(objective: Objective): Promise<AnalysisResult>

  // Suggest strategy adjustments based on objective analysis
  async suggestStrategyAdjustments(objective: Objective, analysisResult?: AnalysisResult): Promise<StrategyRecommendation[]>

  // Schedule regular monitoring of an objective
  async scheduleMonitoring(objective: Objective): Promise<void>
}
```

### BusinessIntegrations

Provides integration capabilities with external systems and the broader .do ecosystem.

```typescript
class BusinessIntegrations {
  constructor()

  // Sync objectives and key results with external OKR systems
  async syncWithExternalOkrSystem(objectives: Objective[], system: 'notion' | 'asana' | 'jira' | 'monday' | string): Promise<void>

  // Publish analysis results to relevant channels
  async publishAnalysisResults(objective: Objective, analysis: AnalysisResult, channels: ('slack' | 'email' | 'dashboard' | string)[]): Promise<void>

  // Create tasks from strategy recommendations
  async createTasksFromRecommendations(recommendations: StrategyRecommendation[], system: 'asana' | 'jira' | 'trello' | 'github' | string): Promise<void>
}
```

## Relationship to business-as-code

The `ai-business` package serves as an underlying primitive for the `business-as-code` package, focusing specifically on AI operation capabilities for business concepts. While `business-as-code` provides a comprehensive framework for defining and operating businesses as code, `ai-business` focuses on the AI-powered monitoring, analysis, and strategy recommendation aspects.

Key differences:

- **Focus**: `ai-business` focuses on AI operations for business concepts, while `business-as-code` provides a broader framework for defining and operating businesses.
- **Granularity**: `ai-business` provides more detailed interfaces for AI operations, while `business-as-code` offers higher-level abstractions.
- **Integration**: `ai-business` can be used independently or as a component within `business-as-code`.

## License

MIT

## Related Packages

- [business-as-code](https://www.npmjs.com/package/business-as-code) - Define, launch, experiment, iterate, and grow your business entirely in code.
- [apis.do](https://www.npmjs.com/package/apis.do) - The foundational SDK for all integrations.
- [functions.do](https://www.npmjs.com/package/functions.do) - AI-powered Functions-as-a-Service.
- [workflows.do](https://www.npmjs.com/package/workflows.do) - Elegant business process orchestration.
