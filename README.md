# [.do](https://dotdo.ai) Business-as-Code

While the cloud enabled Software-as-Software, AI is unlocking [Services-as-Software](https://services.do) .

### [Functions.do](https://functions.do) Generate Objects without a Schema

```ts
import { ai } from 'functions.do'

const brand = ai.storyBrand({ idea: 'Auto Loan Underwriting Services-as-Software' })
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
    channels: ['path to acquire customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },
})

const businessModel = ai.leanCanvas({ idea: 'Auto Loan Underwriting Services-as-Software' })
```

### [Agents.do](https://agents.do) Autonomous Work

```ts
import { browse, research } from 'agents.do'

const { directories } = await research`website directories for ${topic}`({ directories: [String] })

directories.forEach(directory => browse`${directory}.  Request Agents.do to be added to the directory.`)
```


### [Humans.do](https://humans.do) Tasks in a Workflow

```ts
import { human } from 'humans.do'

const ceo = human({ email: 'sam@openai.com' })

ceo.approveRelease({ product: 'GPT-5' })
```

### [Database.do](https://database.do) Schemaless Collections

```typescript
import { db } from 'database.do'

await db.ideas.create({ idea, businessModel, status: 'waitlist' })

const launchedIdeas = await db.ideas.find({ status: 'launched' })
```

### [Database.do](https://database.do) Integrated Embeddings & Vector Search

```typescript
import { db } from 'database.do'

const ideas = await db.ideas.search('automotive finance')
```

### [Database.do](https://database.do) Schemas & Relationships

```typescript
import { DB } from 'database.do'

const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors',
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags', // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author', // Join field to posts (reverse relation)
  },
})
```
