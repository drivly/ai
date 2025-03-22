# functions.do

AI is transforming businesses but integrating LLMs into existing systems presents challenges due to the clash between AI's non-deterministic nature and traditional software's deterministic characteristics.

Key challenges include:

- **Reliability**: AI's unpredictable outputs complicate testing and maintenance
- **Accuracy**: Models can hallucinate or produce incorrect information
- **Model Selection**: Balancing capabilities, speed, and cost across rapidly evolving models
- **Prompt Engineering**: More art than science, difficult to standardize
- **Configuration**: Complex parameter interactions require careful tuning

### The Solution

functions.do creates a clean separation between AI capabilities and application code through strongly-typed interfaces that hide model complexities, enabling:

- Rapid prototyping of AI applications
- Continuous improvement without disrupting application code
- Comprehensive evaluation and optimization strategies

### Usage

You can use it by simply calling any function name with any arguments on the `ai` object like:

```typescript
import { ai } from 'functions.do'

const storyBrand = await ai.storyBrand({ guide: 'aws.amazon.com' })

console.log(storyBrand)
// {
//   productName: 'AWS',
//   hero: 'Businesses looking to innovate and scale their operations efficiently',
//   problem: {
//     external: 'Managing complex IT infrastructure is costly and time-consuming',
//     internal: 'Fear of falling behind competitors technologically',
//     philosophical: 'Believing innovation should be accessible to all businesses',
//     villain: 'Legacy infrastructure constraints and technical debt'
//   },
//   guide: 'AWS positions itself as an experienced guide with unparalleled expertise in cloud solutions',
//   plan: ['Start with a free tier to explore services',
//          'Consult with AWS solutions architects',
//          'Implement scalable infrastructure based on business needs',
//          'Optimize costs with pay-as-you-go model'],
//   callToAction: 'Sign up for AWS Free Tier today',
//   success: 'Businesses innovate faster, reduce costs, and scale globally without infrastructure limitations',
//   failure: 'Companies struggle with outdated infrastructure, higher costs, and inability to compete in the digital economy',
//   messagingExamples: ['Build on the broadest and deepest cloud platform',
//                       'Innovate faster with the right tools for every workload',
//                       'Pay only for what you use with no upfront costs']
// }
```

```typescript
import { ai } from 'functions.do'

const results = await ai.writeBlogPostTitles({
  topic: 'automating business workflows with LLMs',
  audience: 'executives',
  count: 10,
})

console.log(results)
// {
//   blogPostTitles: [
//     '10 Steps to Automate Your Business Workflows with LLMs',
//     'The Executive's Guide to LLM-Powered Process Automation',
//     'Transforming Executive Decision-Making with AI Workflows',
//     'How LLMs Are Revolutionizing C-Suite Productivity',
//     'Strategic Implementation of LLMs: An Executive Roadmap',
//     'Competitive Advantage Through Intelligent Automation',
//     'Measuring ROI on LLM Integration in Enterprise Workflows',
//     'From Boardroom to Automation: The Executive's LLM Playbook',
//     'Scaling Business Operations with AI-Driven Workflow Solutions',
//     'Future-Proofing Your Business with Intelligent LLM Systems'
//   ]
// }
```

Alternatively, you can define the return type of the function during initialization to get strongly-typed responses:

```typescript
import { AI } from 'functions.do'

const ai = AI({
  createLeanCanvas: {
    problems: ['top 3 problems the business solves'],
    customerSegments: ['target customers and users for the product'],
    uniqueValueProposition: 'clear and compelling message that states why you are different and worth buying',
    solutions: ['outline of the solutions to the identified problems'],
    unfairAdvantage: 'something that cannot be easily copied or bought',
    revenueStreams: ['revenue model, lifetime value, revenue, gross margin'],
    costStructure: ['customer acquisition costs', 'distribution costs', 'hosting', 'people', 'etc.'],
    keyMetrics: ['key activities you measure (acquisition, retention, referrals, etc.)'],
    channels: ['path to customers (inbound, outbound, viral, etc.)'],
    earlyAdopters: 'characteristics of the ideal early adopter',
  },
})

const results = await ai.createLeanCanvas({ domain: 'aws.amazon.com' })
```

Finally, you can also define the return type and override system settings for a specific function like:

```typescript
import { ai } from 'functions.do'

const results = await ai.generateLandingPage(
  {
    brand: 'Functions.do',
    idea: 'AI-powered Functions-as-a-Service',
  },
  {
    model: 'anthropic/claude-3.7-sonnet:thinking',
    system: 'You an expert at generating highly-converting marketing copy for startup landing pages',
    temperature: 1.0,
    seed: 1741452228,
    schema: {
      headline: 'attention-grabbing headline that clearly states value proposition',
      subheadline: 'supporting statement that adds clarity to the headline',
      productDescription: 'concise explanation of what the product does and its benefits',
      keyFeatures: ['list of main features or benefits'],
      socialProof: ['testimonials, user counts, or other trust indicators'],
      captureForm: 'description of email capture form and call to action',
      incentive: 'what users get for joining the waitlist (early access, discount, etc.)',
      visualElements: 'description of images, videos, or other visual elements',
      faq: [
        {
          question: 'frequently asked question related to an objection',
          answer: 'clear answer to the question that overcomes the objection',
        },
      ],
      launchDate: 'expected product launch date or timeline',
      callToAction: 'primary button text and action',
      secondaryAction: 'secondary button text and action',
    },
  },
)
```
