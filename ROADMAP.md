# [.do](https://dotdo.ai) Roadmap


## 0.1.0

### [Functions.do](https://functions.do) Generate Objects without a Schema

```ts
import { ai } from 'functions.do'

const businessModel = ai.leanCanvas({ concept: 'Auto Loan Underwriting Services-as-Software' })
```

### [Functions.do](https://functions.do) Generate Objects with a Type-safe Schema

```ts
import { AI } from 'functions.do'

const ai = AI({
  leanCanvas: {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },
})

const businessModel = ai.leanCanvas({ concept: 'Auto Loan Underwriting Services-as-Software' })
```

## 0.2.0

### [Evals.do](https://evals.do) Measure AI Performance

```ts
import { Eval, JSONDiff } from 'evals.do'

Eval('W-2 OCR', {

  // compare different models
  models: [
    'openai/o3',
    'openai/o4-mini',
    'openai/o4-mini-high',
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.1-nano',
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview:thinking',
    'google/gemini-2.5-flash-preview',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.7-sonnet:thinking',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
    'x-ai/grok-3-beta',
    'x-ai/grok-3-mini-beta',
  ],
  

  // calculate all variations of inputs
  inputs: async () => cartesian({
    image:[1, 2, 3, 4, 5, 6], 
    blur:[0, 1, 2, 3], 
    res:[512, 768, 1536, 2000, 3072],
  }).map(({image, blur, res}) => ({ image: `https://…/w2_img${image}_blur${blur}_res${res}.jpg` })),

  // run 3 times for each input
  seeds: 3, 
  prompt: 'Extract the data from the image.',
  temperature: 0,
  expected: expectedOutput,
  schema : W2,
  scorers : [JSONDiff],             
})
```

### [Experiments.do](https://experiments.do) Compare Models

```ts
import { ai } from 'functions.do'
import { Battle } from 'evals.do'
import { Experiment } from 'experiments.do'

Experiment({
  models: [
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.5-preview',
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview',
    'google/gemini-2.0-flash',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.5-sonnet',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
    'x-ai/grok-3-beta',
    'x-ai/grok-3-mini-beta',
  ],
  temperature: [0.8, 1],
  inputs: cartesian({
    topic: ['Business-as-Code', 'Services-as-Software', 'AI Agents', 'Agentic Workflows'],
    audience: ['startup founders', 'empowered CTOs', 'alpha developers', 'AI engineers'],
    tone: ['informative', 'engaging', 'persuasive', 'conversational', 'technical'],
  }),
  task: ai.listBlogPostTitles
  scorer: [Battle],
})
```
  