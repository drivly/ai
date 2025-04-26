# Drivly Package Registry

A collection of packages developed by Drivly, organized by category.

## AI Primitives

### language-models
[![npm version](https://img.shields.io/npm/v/language-models.svg)](https://www.npmjs.com/package/language-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/language-models)

Language model abstractions for AI functions, workflows, and evaluation.

**Features:**
- Model selection based on capabilities and provider
- Classification layer for matching content to optimal models
- Support for various model providers including OpenAI, Anthropic, Claude, and more
- Fallback support for when a model is unavailable or lacks capabilities
- Customizable weights for content types and model performance

### ai-functions
[![npm version](https://img.shields.io/npm/v/ai-functions.svg)](https://www.npmjs.com/package/ai-functions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-functions)

Elegant, type-safe AI functions using Vercel AI SDK.

**Features:**
- Dynamic AI functions through proxies
- Template literals for content generation
- Schema validation with Zod
- List and markdown generation
- Model configuration options
- Type-safe interfaces for predictable outputs
- Multiple invocation patterns

### ai-providers
[![npm version](https://img.shields.io/npm/v/ai-providers.svg)](https://www.npmjs.com/package/ai-providers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-providers)

Provider router for AI models including OpenAI, Anthropic, and Google.

**Features:**
- Unified interface for multiple AI model providers
- Integration with language-models package
- Support for OpenAI, Anthropic, Google, and more
- Simplifies model selection and routing

### ai-database
[![npm version](https://img.shields.io/npm/v/ai-database.svg)](https://www.npmjs.com/package/ai-database)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-database)

Direct interface to Payload CMS with database.do compatibility.

**Features:**
- Compatible API with database.do
- Environment-specific adapters for Node.js and Edge
- Embedding generation and similarity calculation
- Collections access through a familiar interface
- Search capabilities for documents

### ai-workflows
[![npm version](https://img.shields.io/npm/v/ai-workflows.svg)](https://www.npmjs.com/package/ai-workflows)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-workflows)

AI workflows for orchestrating AI functions.

**Features:**
- Orchestration of AI function sequences
- CLI capabilities for workflow execution
- Integration with ai-functions package
- Automation of complex AI tasks

### ai-models
[![npm version](https://img.shields.io/npm/v/ai-models.svg)](https://www.npmjs.com/package/ai-models)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-models)

AI model abstractions for the SDK, Functions, Workflows, and Evaluations.

**Features:**
- Support for various model providers and creators
- Capability-based model selection
- Meta-model management for optimized routing
- Classification system for content type analysis
- Runtime configuration via query parameters

### ai-business
[![npm version](https://img.shields.io/npm/v/ai-business.svg)](https://www.npmjs.com/package/ai-business)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/ai-business)

AI-powered business primitives for representing and operating business concepts as code.

**Features:**
- AI-Enhanced OKRs (Objectives and Key Results)
- Automated monitoring of business objectives
- Strategy recommendations from AI analysis
- Integration with external business systems
- Extensible architecture for custom AI operations

## Additional Packages

### business-as-code
[![npm version](https://img.shields.io/npm/v/business-as-code.svg)](https://www.npmjs.com/package/business-as-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/business-as-code)

Define, launch, experiment, iterate, and grow your business entirely in code.

### clickable-apis
[![npm version](https://img.shields.io/npm/v/clickable-apis.svg)](https://www.npmjs.com/package/clickable-apis)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/clickable-apis)

Library for creating APIs that can be invoked via UI clicks.

### deploy-worker
[![npm version](https://img.shields.io/npm/v/deploy-worker.svg)](https://www.npmjs.com/package/deploy-worker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/deploy-worker)

Worker for deploying applications.

### durable-objects-cron
[![npm version](https://img.shields.io/npm/v/durable-objects-cron.svg)](https://www.npmjs.com/package/durable-objects-cron)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/durable-objects-cron)

Cron job functionality using Cloudflare Durable Objects.

### durable-objects-nosql
[![npm version](https://img.shields.io/npm/v/durable-objects-nosql.svg)](https://www.npmjs.com/package/durable-objects-nosql)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/durable-objects-nosql)

NoSQL database functionality using Cloudflare Durable Objects.

### exec-symbols
[![npm version](https://img.shields.io/npm/v/exec-symbols.svg)](https://www.npmjs.com/package/exec-symbols)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/exec-symbols)

Utility for executing code using symbol primitives.

### mdxdb
[![npm version](https://img.shields.io/npm/v/mdxdb.svg)](https://www.npmjs.com/package/mdxdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/mdxdb)

Database for MDX content.

### mdxld
[![npm version](https://img.shields.io/npm/v/mdxld.svg)](https://www.npmjs.com/package/mdxld)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/mdxld)

MDX-LD processing and rendering utilities.

### payload-agent
[![npm version](https://img.shields.io/npm/v/payload-agent.svg)](https://www.npmjs.com/package/payload-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/payload-agent)

Agent capabilities for Payload CMS.

### simple-payload
[![npm version](https://img.shields.io/npm/v/simple-payload.svg)](https://www.npmjs.com/package/simple-payload)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/drivly/ai/tree/main/pkgs/simple-payload)

Simplified interface for Payload CMS operations.
