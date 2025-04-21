# goals.do

[![npm version](https://img.shields.io/npm/v/goals.do.svg)](https://www.npmjs.com/package/goals.do)
[![npm downloads](https://img.shields.io/npm/dm/goals.do.svg)](https://www.npmjs.com/package/goals.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

A concise, elegant SDK for defining and tracking OKRs (Objectives & Key Results).

## The Challenge

Managing OKRs effectively presents several challenges:

- **Goal Setting**: Creating clear, measurable, and achievable objectives
- **Progress Tracking**: Monitoring key results and adjusting as needed
- **Accountability**: Ensuring responsibility and ownership
- **Metrics**: Defining and measuring success criteria
- **Integration**: Connecting OKRs with other business systems

## The Solution

goals.do provides a clean, type-safe interface for defining and tracking OKRs:

- Define objectives and key results with a concise, elegant syntax
- Track progress of key results
- Calculate overall objective progress automatically
- Integrate with KPIs and other systems through APIs.do

## Installation

```bash
npm install goals.do
# or
yarn add goals.do
# or
pnpm add goals.do
```

## Basic Usage

The Goals.do SDK provides a simple, expressive syntax for defining and tracking your organization's OKRs:

```typescript
import { Goals } from 'goals.do'

// Define objectives and key results
const companyGoals = Goals({
  customerSuccess: {
    description: 'Create delighted customers who achieve their goals',
    keyResults: [
      'Achieve 95% customer satisfaction score by Q4',
      'Reduce average support resolution time by 30%',
      {
        description: 'Increase customer retention rate to 85%',
        target: 85,
        currentValue: 72,
        unit: '%',
      },
    ],
  },
  productInnovation: {
    description: 'Build features that solve real customer problems',
    keyResults: [
      'Launch 3 major features by Q2',
      'Achieve 80% feature adoption within 30 days of launch',
      {
        description: 'Reduce feature development cycle time by 20%',
        target: 20,
        currentValue: 0,
        unit: '%',
      },
    ],
  },
})

// Save goals to database
await companyGoals.save()

// Track progress
await companyGoals.updateProgress('customerSuccess', 'Achieve 95% customer satisfaction score by Q4', 85)

// Get current progress
const progress = await companyGoals.getProgress()
console.log(progress)
```

## API Reference

### Goals(input, options)

Creates a new goals instance with the specified objectives and key results.

#### Parameters

- `input`: An object where each key represents an objective with key results
- `options` (optional): Client options for API connection

#### Returns

A goals instance with methods for saving and tracking progress.

### Goals Instance Methods

#### save()

Saves all defined objectives and key results to the database.

**Returns**: Promise resolving to an object mapping objective keys to their saved Goal objects.

#### updateProgress(objectiveKey, keyResult, progress)

Updates the progress of a specific key result.

**Parameters**:

- `objectiveKey`: The key of the objective containing the key result
- `keyResult`: Either the string description of the key result or its index in the array
- `progress`: The progress value (0-100)

**Returns**: Promise that resolves when the update is complete.

#### getProgress()

Gets the current progress for all objectives and key results.

**Returns**: Promise resolving to an object with progress information.

#### toJSON()

Converts the goals instance to a JSON representation.

**Returns**: The original input object.

### Traditional CRUD API

The SDK also provides a traditional CRUD API for working with goals:

```typescript
import { GoalsClient } from 'goals.do'

const client = new GoalsClient({ apiKey: 'your-api-key' })

// Find all goals
const goals = await client.find()

// Create a goal
const newGoal = await client.create({
  name: 'Product Innovation',
  description: 'Build features that solve real customer problems',
})

// Update a goal
await client.update(newGoal.id, { progress: 75 })

// Delete a goal
await client.delete(newGoal.id)
```

## Integration with KPIs

The Goals.do SDK integrates with the KPIs collection, allowing you to connect key results to specific KPIs:

```typescript
const businessGoals = Goals({
  revenue: {
    description: 'Increase annual recurring revenue',
    keyResults: [
      {
        description: 'Achieve $10M ARR by end of year',
        target: 10000000,
        currentValue: 7500000,
        unit: '$',
        kpiRelationship: 'monthly-recurring-revenue',
      },
    ],
  },
})
```

## Related Projects

- [plans.do](https://plans.do) - Planning and roadmap management
- [projects.do](https://projects.do) - Project management with tasks and resources
- [functions.do](https://functions.do) - Typesafe AI Functions
- [workflows.do](https://workflows.do) - Business Process Automation
- [agents.do](https://agents.do) - Autonomous Digital Workers
- [apis.do](https://apis.do) - Clickable Developer Experiences

## License

MIT © [Drivly](https://driv.ly)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem
