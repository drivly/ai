
export interface SDK {
  title: string;
  description?: string;
  content: string;
  slug: string;
}

export const sdks: SDK[] = [
  {
    title: 'workflows.do',
    description: 'Elegant business process orchestration',
    slug: 'workflows.do',
    content: `
      <h1>Workflows.do</h1>
      <p>Elegant business process orchestration SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install workflows.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { workflows } from 'workflows.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'apis.do',
    description: 'Unified API gateway',
    slug: 'apis.do',
    content: `
      <h1>APIs.do</h1>
      <p>Unified API gateway SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install apis.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { apis } from 'apis.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Foundation for all other .do SDKs</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'functions.do',
    description: 'AI function execution',
    slug: 'functions.do',
    content: `
      <h1>Functions.do</h1>
      <p>AI function execution SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install functions.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { functions } from 'functions.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'agents.do',
    description: 'Autonomous AI workers',
    slug: 'agents.do',
    content: `
      <h1>Agents.do</h1>
      <p>Autonomous AI workers SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install agents.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { agents } from 'agents.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'database.do',
    description: 'Data storage and retrieval',
    slug: 'database.do',
    content: `
      <h1>Database.do</h1>
      <p>Data storage and retrieval SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install database.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { database } from 'database.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'analytics.do',
    description: 'Performance measurement',
    slug: 'analytics.do',
    content: `
      <h1>Analytics.do</h1>
      <p>Performance measurement SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install analytics.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { analytics } from 'analytics.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'gpt.do',
    description: 'GPT model integration',
    slug: 'gpt.do',
    content: `
      <h1>GPT.do</h1>
      <p>GPT model integration SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install gpt.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { gpt } from 'gpt.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'evals.do',
    description: 'Evaluation framework',
    slug: 'evals.do',
    content: `
      <h1>Evals.do</h1>
      <p>Evaluation framework SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install evals.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { evals } from 'evals.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'experiments.do',
    description: 'A/B testing and experimentation',
    slug: 'experiments.do',
    content: `
      <h1>Experiments.do</h1>
      <p>A/B testing and experimentation SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install experiments.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { experiments } from 'experiments.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'llm.do',
    description: 'Language model interface',
    slug: 'llm.do',
    content: `
      <h1>LLM.do</h1>
      <p>Language model interface SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install llm.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { llm } from 'llm.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  },
  {
    title: 'models.do',
    description: 'Model management',
    slug: 'models.do',
    content: `
      <h1>Models.do</h1>
      <p>Model management SDK for the .do platform.</p>
      
      <h2>Installation</h2>
      <pre><code>npm install models.do</code></pre>
      
      <h2>Usage</h2>
      <pre><code>import { models } from 'models.do'</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li>Lightweight SDK with minimal dependencies</li>
        <li>Built on the unified API gateway (apis.do)</li>
        <li>TypeScript support with full type definitions</li>
        <li>Compatible with both browser and Node.js environments</li>
      </ul>
    `
  }
];
