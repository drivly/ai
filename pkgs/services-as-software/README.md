# services-as-software

Define services with objectives, key results, and various pricing models for the agentic services architecture.

## Installation

```bash
npm install services-as-software
# or
yarn add services-as-software
# or
pnpm add services-as-software
```

## Overview

The `services-as-software` package enables defining services with clear objectives, measurable key results, and support for multiple pricing models. It allows Functions, Workflows, and Agents to be offered as Services with appropriate pricing and business models.

## Usage

### Basic Service Definition

```typescript
import { Service } from 'services-as-software';

const myService = Service({
  name: 'Content Generation Service',
  description: 'AI-powered content generation for marketing teams',
  objective: {
    description: 'Provide high-quality content generation that increases marketing efficiency',
    keyResults: []
  },
  keyResults: [
    {
      description: 'Reduce content creation time',
      target: 50,
      currentValue: 0,
      unit: 'percent'
    },
    {
      description: 'Maintain content quality score',
      target: 8,
      currentValue: 0,
      unit: 'rating'
    }
  ],
  pricing: {
    model: 'cost-based',
    costBase: 10,
    fixedCosts: 5,
    variableCosts: 2
  },
  implementation: {
    type: 'function',
    id: 'content-generator-123'
  }
});

// Register the service
const registeredService = await myService.register();

// Calculate price
const price = myService.calculatePrice({ quantity: 5 });

// Track progress towards key results
myService.trackProgress({
  'Reduce content creation time': 30,
  'Maintain content quality score': 9
});

// Check if objective is achieved
const achieved = myService.isObjectiveAchieved();
```

### Pricing Models

The package supports four pricing models:

#### 1. Cost-based Pricing

```typescript
const service = Service({
  // ...other properties
  pricing: {
    model: 'cost-based',
    costBase: 100,
    fixedCosts: 50,
    variableCosts: 10
  }
});

// Calculate price for 5 units
const price = service.calculatePrice({ quantity: 5 }); // 200 (100 + 50 + 10*5)
```

#### 2. Margin-based Pricing

```typescript
const service = Service({
  // ...other properties
  pricing: {
    model: 'margin-based',
    costBase: 100,
    marginPercentage: 20
  }
});

// Calculate price for 2 units
const price = service.calculatePrice({ quantity: 2 }); // 240 (100*2 + 20% margin)
```

#### 3. Activity-based Pricing

```typescript
const service = Service({
  // ...other properties
  pricing: {
    model: 'activity-based',
    activities: [
      { name: 'research', rate: 50 },
      { name: 'writing', rate: 100 },
      { name: 'editing', rate: 30 }
    ]
  }
});

// Calculate price based on activities performed
const price = service.calculatePrice({
  activities: {
    research: 2,
    writing: 1,
    editing: 3
  }
}); // 290 (50*2 + 100*1 + 30*3)
```

#### 4. Outcome-based Pricing

```typescript
const service = Service({
  // ...other properties
  pricing: {
    model: 'outcome-based',
    outcomes: [
      { metric: 'conversion-rate', targetValue: 5, price: 500 },
      { metric: 'engagement', targetValue: 10000, price: 300 }
    ]
  }
});

// Calculate price based on achieved outcomes
const price = service.calculatePrice({
  outcomes: {
    'conversion-rate': 6.5,
    'engagement': 8000
  }
}); // 500 (only conversion-rate target was met)
```

### Offering Functions as Services

```typescript
import { Service } from 'services-as-software';

const functionAsService = Service({
  name: 'Text Summarization',
  objective: {
    description: 'Provide accurate text summarization',
    keyResults: []
  },
  keyResults: [
    {
      description: 'Summarization accuracy',
      target: 90,
      unit: 'percent'
    }
  ],
  pricing: {
    model: 'cost-based',
    costBase: 5,
    variableCosts: 0.01
  },
  implementation: {
    type: 'function',
    id: 'text-summarizer-function'
  }
});
```

### Offering Workflows as Services

```typescript
import { Service } from 'services-as-software';

const workflowAsService = Service({
  name: 'Content Production Pipeline',
  objective: {
    description: 'End-to-end content production',
    keyResults: []
  },
  keyResults: [
    {
      description: 'Average production time',
      target: 24,
      unit: 'hours'
    }
  ],
  pricing: {
    model: 'activity-based',
    activities: [
      { name: 'research', rate: 100 },
      { name: 'writing', rate: 200 },
      { name: 'editing', rate: 50 },
      { name: 'publishing', rate: 30 }
    ]
  },
  implementation: {
    type: 'workflow',
    id: 'content-production-workflow'
  }
});
```

### Offering Agents as Services

```typescript
import { Service } from 'services-as-software';

const agentAsService = Service({
  name: 'Customer Support Agent',
  objective: {
    description: 'Provide excellent customer support',
    keyResults: []
  },
  keyResults: [
    {
      description: 'Customer satisfaction score',
      target: 4.5,
      unit: 'rating'
    },
    {
      description: 'First response time',
      target: 5,
      unit: 'minutes'
    }
  ],
  pricing: {
    model: 'outcome-based',
    outcomes: [
      { metric: 'resolution-rate', targetValue: 95, price: 1000 },
      { metric: 'satisfaction-score', targetValue: 4.8, price: 500 }
    ]
  },
  implementation: {
    type: 'agent',
    id: 'customer-support-agent'
  }
});
```

## API Reference

### Service Function

```typescript
function Service(definition: ServiceDefinition): ServiceObject
```

Creates a service with the given definition.

### ServiceDefinition

```typescript
interface ServiceDefinition {
  name: string;
  description?: string;
  objective: Objective;
  keyResults: KeyResult[];
  pricing: ServicePricing;
  implementation: ImplementationDetails;
  metadata?: Record<string, any>;
}
```

### Pricing Models

```typescript
type PricingModel = 'cost-based' | 'margin-based' | 'activity-based' | 'outcome-based';

type ServicePricing = 
  | CostBasedPricing
  | MarginBasedPricing
  | ActivityBasedPricing
  | OutcomeBasedPricing;
```

## Integration with Existing Services

The `services-as-software` package is designed to work with the existing services ecosystem:

- Integrates with the `services.do` SDK for service registration
- Extends the business model concepts from `Business-as-Code`
- Compatible with Functions, Workflows, and Agents collections

## License

MIT
