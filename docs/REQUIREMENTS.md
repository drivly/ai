# AI Primitives Platform: Product Requirements Document

## 1. Executive Summary

The AI Primitives Platform is a comprehensive suite of AI-powered tools and services designed to enable developers and businesses to define, execute, and iterate on business processes as clean and simple code. The platform consists of several core components that work together seamlessly to provide a complete solution for AI-driven business process automation, making it simple enough for a non-technical business person to read and work with an AI or technical teammate to build and iterate on workflows.

### 1.1 Vision

To create the most developer-friendly and business-effective AI primitives platform that transforms complex workflows into simple, typesafe code, clickable APIs, and autonomous agents. We believe that business processes should be defined and executed as code ("Business-as-Code"), enabling rapid iteration and optimization.

### 1.2 Key Value Propositions

- **Simplicity**: Transform complex AI capabilities into simple, typesafe APIs without leaky abstractions
- **Integration**: Seamlessly connect with existing systems and workflows through standardized interfaces
- **Autonomy**: Deploy intelligent agents that handle routine tasks with minimal supervision
- **Economics**: Validate and optimize workflows for measurable business value
- **Developer Experience**: Clickable APIs with comprehensive documentation and examples
- **Business Focus**: Define business processes as clean code that non-technical stakeholders can understand

## 2. Core Components

### 2.1 Functions.do - Inputs to Structured Outputs

#### Description

Provides a framework for transforming inputs into structured, typesafe outputs using AI models. Functions.do creates a clean separation between AI capabilities and application code through strongly-typed interfaces that hide model complexities, enabling rapid prototyping, continuous improvement, and comprehensive evaluation.

#### Key Features

- Type-safe function results without complexity
- Support for various output formats (JSON, Markdown, Code)
- Model/config/prompt overrides
- Caching for performance optimization
- Temperature and model adjustment capabilities
- Multiple invocation patterns (tagged template literals, function calls)
- Custom schema definition
- Advanced configuration options

#### Requirements

- Must support schema-based and schema-less operations
- Must handle various output formats including JSON, markdown, and code
- Must provide links to adjust parameters (temperature, models, seeds)
- Must support saved prompts and schemas
- Must integrate with concurrency management
- Must support multiple function types (Generation, Code, Human, Agent)
- Must provide flexible proxy for invoking AI functions with various patterns
- Must support local configuration and prompts in the `.ai` folder
- Must enable CLI operations for init, push, and pull configurations
- Must abstract away model selection, prompt engineering, and settings optimization

### 2.2 Workflows.do - Business-as-Code

#### Description

Enables the creation and execution of complex business workflows using a code-first approach. Workflows.do provides a simple yet powerful way to define AI-powered workflows with strongly-typed functions, allowing business processes to be defined as clean, readable code.

#### Key Features

- Event-driven workflow execution
- Integration with external data sources and APIs
- Personalization and data enrichment capabilities
- Automated scheduling and execution
- Strongly-typed AI function schemas
- Full TypeScript support for reliable development
- Context object with AI functions, API integrations, and database access
- Multi-step AI process orchestration

#### Requirements

- Must support event-triggered workflow execution
- Must provide reliable execution of business processes
- Must integrate with the event system (Triggers, Searches, Actions)
- Must support comprehensive logging and monitoring
- Must enable strongly-typed AI function schemas
- Must support complex, multi-step AI processes with full TypeScript support
- Must provide context object with access to AI functions, APIs, and database
- Must enable parallel execution of tasks for efficiency
- Must support error handling and recovery mechanisms

### 2.3 Agents.do - Autonomous Digital Workers

#### Description

Framework for creating, deploying, and managing autonomous digital workers that can perform complex tasks with minimal human intervention. Agents.do enables the creation of autonomous agents that can handle routine operations, make decisions based on predefined criteria, and adapt to changing conditions.

#### Key Features

- Configurable agent capabilities and knowledge bases
- Behavior definition using customizable functions
- Deployment and monitoring infrastructure
- Integration with external systems
- Predefined triggers for event-based activation
- Integrated search capabilities for context awareness
- Predefined actions for external system interaction
- Performance metrics and KPI tracking

#### Requirements

- Must support agent definition with capabilities and knowledge bases
- Must prevent duplicate agent creation
- Must provide monitoring and oversight capabilities
- Must integrate with GitHub and other external platforms
- Must support deep research and analysis capabilities
- Must provide agent client configuration options
- Must support methods for creating, updating, and managing agents
- Must enable integration with Functions and Workflows for complex tasks
- Must support various integrations (chat, slack, email, etc.)
- Must provide a consistent API for agent interactions
- Must include robust error handling and recovery mechanisms

## 3. Event System

### 3.1 Triggers.do - Start Business Processes

#### Description

Provides a powerful framework for initiating workflows based on various events from internal and external systems. It enables you to create event-driven architectures that respond automatically to changes in your business environment, ensuring timely execution of critical processes.

#### Key Features

- Webhook-based triggers
- Integration with third-party systems
- Configurable trigger definitions
- Event-driven architecture support
- Automatic response to business environment changes

#### Requirements

- Must expose a clickable API of available triggers
- Must ingest triggers from integrations
- Must configure trigger collections properly
- Must provide easy configuration for action execution
- Must support various event sources and types
- Must ensure reliable event delivery and processing
- Must provide event filtering and routing capabilities

### 3.2 Searches.do - Provide Context & Understanding

#### Description

Provides a unified interface for powerful data retrieval across various sources. It enables you to find relevant information quickly and efficiently, providing the context needed for intelligent decision-making in your AI applications.

#### Key Features

- Advanced search capabilities
- Context-aware results
- Integration with workflow decision making
- Cross-source data retrieval
- Intelligent ranking and relevance scoring
- Contextual understanding of search queries

#### Requirements

- Must provide reliable and relevant search results
- Must integrate with the overall platform context
- Must support search box functionality without errors
- Must enable searching across multiple data sources
- Must provide filtering and sorting capabilities
- Must support natural language search queries
- Must return results in a consistent, structured format

### 3.3 Actions.do - Impact the External World

#### Description

Provides a powerful framework for defining and executing operations that interact with external systems. It enables you to create reusable, composable actions that can be triggered from your workflows to create real-world impact.

#### Key Features

- Predefined action templates
- Integration with external systems and APIs
- Action result handling and error recovery
- Reusable, composable action definitions
- Secure execution of external operations
- Comprehensive error handling and retry mechanisms

#### Requirements

- Must expose a clickable API of available actions
- Must ingest actions from integrations
- Must configure action collections properly
- Must provide reliable execution of external actions
- Must support secure authentication with external systems
- Must implement proper error handling and recovery
- Must enable composition of multiple actions into sequences
- Must provide detailed execution logs and status tracking

## 4. Foundation Components

### 4.1 LLM.do - Intelligent AI Gateway

#### Description

Provides a powerful gateway for routing AI requests to the optimal language models based on capabilities, cost, and performance requirements. It enables you to leverage the best AI models for each specific task without being locked into a single provider.

#### Key Features

- Multi-model support across various providers
- Tool use integration for enhanced capabilities
- Clickable API experience for easy testing
- Intelligent routing based on task requirements
- Cost optimization across model providers
- Performance monitoring and analytics

#### Requirements

- Must support integrated tool use
- Must provide clickable experience with GET requests
- Must support domain-specific LLM configurations
- Must use appropriate fallback providers
- Must enable text generation via `llm('model-name')` pattern
- Must support embeddings via `llm.embed('model-name')` pattern
- Must provide consistent API across different model providers
- Must optimize for cost-performance balance

### 4.2 Database.do - AI-enriched Data

#### Description

AI-native data access layer with search and CRUD capabilities. Database.do simplifies database operations with an intuitive API, providing a seamless interface for managing collections and performing operations with built-in AI capabilities.

#### Key Features

- AI-enriched data storage and retrieval
- Seamless integration with other platform components
- Advanced search capabilities
- Multiple database support (MongoDB, PostgreSQL, SQLite)
- Flexible schema support for both schema-less and defined schema types
- Admin UI included for data management
- Full REST API for List + CRUD operations
- Advanced querying with filtering, sorting, and pagination

#### Requirements

- Must provide reliable data storage and retrieval
- Must support AI-enhanced search and querying
- Must integrate with other platform components
- Must support multiple database backends (MongoDB, PostgreSQL, SQLite)
- Must provide schema definition capabilities
- Must enable working with related data
- Must include authentication and authorization features
- Must maintain zero dependencies except for apis.do

### 4.3 Evals.do - Measure & Improve

#### Description

Provides a powerful framework for evaluating the performance and quality of your AI applications. It enables you to systematically assess model outputs, function results, and workflow outcomes to ensure they meet your business requirements.

#### Key Features

- Systematic assessment of model outputs
- Function result evaluation
- Workflow outcome validation
- Comparative model performance analysis
- Automated quality assurance
- Business impact measurement
- Continuous improvement feedback loops

#### Requirements

- Must provide reliable evaluation of AI outputs
- Must integrate with the overall quality assurance process
- Must support continuous improvement of AI components
- Must enable comparison between different model versions
- Must provide metrics for accuracy, reliability, and business value
- Must support automated testing of AI functions and workflows
- Must generate actionable insights for improvement

### 4.4 Integrations.do - Connect Your Apps

#### Description

Provides a seamless way to connect your AI applications with external systems, APIs, and services. It enables you to extend your workflows with powerful integrations that enhance functionality and automate processes across your entire tech stack.

#### Key Features

- Predefined integration templates
- Webhook security and verification
- Configuration management
- Extensive API connector library
- Bi-directional data synchronization
- Event-driven integration patterns
- Custom integration development

#### Requirements

- Must verify webhook secrets for security
- Must support various integration platforms (e.g., Composio)
- Must refactor integration collections properly
- Must provide standardized interfaces for external systems
- Must support authentication with various API providers
- Must enable data transformation between systems
- Must include error handling and retry mechanisms
- Must maintain proper documentation of integration points

## 5. API Experience

### 5.1 APIs.do - Clickable Developer Experiences

#### Description

Provides a clickable, discoverable interface for all platform APIs, delivering economically valuable work through simple, well-documented interfaces. APIs.do serves as the foundation for the entire platform, enabling consistent, user-friendly experiences across all components.

#### Key Features

- Consistent API presentation
- Self-documenting interfaces
- User authentication and authorization
- Standardized API response format
- Comprehensive API metadata
- Clickable API navigation
- Automatic SDK generation

#### Requirements

- Must implement user footer object
- Must implement API header object
- Must extract database and payload dependencies
- Must handle shortcut .do domains properly
- Must create SDK packages for publication
- Must provide standardized JSON response format
- Must include comprehensive API metadata
- Must support authentication and authorization
- Must enable cross-domain API access
- Must generate TypeScript types for all APIs

## 6. Additional Components

### 6.1 Events.do - Track Business Events

#### Description

Events.do provides a powerful framework for tracking, analyzing, and responding to business events across your organization. It enables you to create a comprehensive event-driven architecture that captures valuable data about user actions, system operations, and business processes.

#### Key Features

- Comprehensive event tracking
- Real-time event processing
- Event analytics and visualization
- Event-driven architecture support
- Integration with workflows and agents

#### Requirements

- Must capture events from various sources
- Must provide reliable event storage and retrieval
- Must enable real-time event processing
- Must support event filtering and routing
- Must integrate with workflows for automated responses

### 6.2 Experiments.do - Iterate & Improve

#### Description

Experiments.do provides a powerful framework for testing hypotheses, measuring outcomes, and iteratively improving your AI applications. It enables you to run controlled experiments to validate ideas, optimize performance, and make data-driven decisions.

#### Key Features

- A/B testing capabilities
- Performance measurement
- Statistical analysis
- Experiment management
- Integration with analytics

#### Requirements

- Must support various experiment types
- Must provide reliable measurement of outcomes
- Must enable statistical analysis of results
- Must integrate with other platform components
- Must support continuous experimentation

### 6.3 Benchmarks.do - Compare Models

#### Description

Benchmarks.do provides a powerful framework for evaluating and comparing AI models across various dimensions. It enables you to make informed decisions about which models to use for different tasks based on objective performance metrics.

#### Key Features

- Standardized evaluation metrics
- Cross-model comparison
- Performance visualization
- Cost-benefit analysis
- Integration with model selection

#### Requirements

- Must support various evaluation metrics
- Must enable fair comparison between models
- Must provide detailed performance insights
- Must integrate with model selection processes
- Must support custom benchmark creation

### 6.4 Traces.do - Debug & Understand

#### Description

Traces.do provides a powerful framework for capturing, visualizing, and analyzing the execution of your AI applications. It enables you to understand how your functions, workflows, and agents operate, making it easier to debug issues and optimize performance.

#### Key Features

- Execution tracing
- Visual execution graphs
- Performance profiling
- Error identification
- Integration with debugging tools

#### Requirements

- Must capture detailed execution information
- Must provide visual representation of execution flows
- Must identify performance bottlenecks
- Must help pinpoint errors and issues
- Must integrate with development workflows

### 6.5 Analytics.do - Measure Business Impact

#### Description

Analytics.do provides a powerful framework for measuring and analyzing the business impact of your AI applications. It enables you to track key metrics, visualize performance trends, and make data-driven decisions about your AI investments.

#### Key Features

- Business KPI tracking
- Performance dashboards
- Trend analysis
- ROI calculation
- Integration with business systems

#### Requirements

- Must track relevant business metrics
- Must provide insightful visualizations
- Must enable trend analysis over time
- Must calculate return on AI investments
- Must integrate with business reporting systems

### 6.6 AGI.do - Economically Valuable Work

#### Description

AGI.do provides a powerful framework for creating and deploying advanced AI systems that can perform economically valuable work across various domains. It enables you to build sophisticated AI applications that deliver measurable business value through automation, optimization, and intelligent decision-making.

#### Key Features

- Advanced AI capabilities
- Cross-domain intelligence
- Economic value optimization
- Autonomous operation
- Integration with business processes

#### Requirements

- Must deliver measurable economic value
- Must operate across multiple domains
- Must optimize for business outcomes
- Must provide autonomous operation capabilities
- Must integrate seamlessly with existing systems

### 6.7 Nouns.do - Entities in Your Business

#### Description

Nouns.do provides a powerful framework for defining and managing the entities that make up your business domain. It enables you to create a structured representation of your business objects and their relationships.

#### Key Features

- Entity definition and management
- Relationship modeling
- Business domain representation
- Integration with other platform components
- Semantic understanding of business entities

#### Requirements

- Must support comprehensive entity definition
- Must enable relationship modeling between entities
- Must integrate with other platform components
- Must provide consistent entity representation
- Must support business domain modeling

### 6.8 Verbs.do - Represent Potential Actions

#### Description

Verbs.do provides a powerful framework for defining and managing the actions that can be performed within your business domain. It enables you to create a structured representation of operations that connect entities and drive business processes.

#### Key Features

- Action definition and management
- Operation modeling
- Process flow representation
- Integration with entities (Nouns)
- Semantic understanding of business operations

#### Requirements

- Must support comprehensive action definition
- Must enable operation modeling between entities
- Must integrate with Nouns.do for entity connections
- Must provide consistent action representation
- Must support business process modeling

### 6.9 Things.do - Physical and Virtual Objects

#### Description

Things.do provides a powerful framework for modeling and managing both physical and virtual objects in your business domain. It enables you to create a structured representation of the tangible and intangible assets that your business interacts with.

#### Key Features

- Object modeling and management
- Physical and virtual asset representation
- Asset relationship mapping
- Integration with other platform components
- Real-world object digital twins

#### Requirements

- Must support both physical and virtual object modeling
- Must enable asset relationship mapping
- Must integrate with other platform components
- Must provide consistent object representation
- Must support digital twin capabilities for physical objects

## 7. Technical Requirements

### 7.1 Architecture

- Monorepo structure using pnpm workspaces
- Modular design with clear separation of concerns
- Scalable infrastructure with proper error handling
- Zero-dependency SDK implementations
- Backend implementations in tasks directory
- Consistent API patterns across all components

### 7.2 Performance

- Response times under 500ms for API calls
- Scalable to handle thousands of concurrent users
- Efficient data fetching and caching strategies
- Optimized for both browser and Node.js environments
- Minimal bundle size for SDK packages
- Efficient resource utilization

### 7.3 Security

- OAuth-based authentication
- Webhook secret verification
- Secure handling of API keys and sensitive data
- Proper input validation
- CORS configuration for cross-domain access
- Rate limiting for API endpoints
- Comprehensive error handling

### 7.4 Development Standards

- TypeScript with strict type checking
- ESLint and Prettier for code quality
- Conventional Commits specification
- Comprehensive test coverage
- Modern Node.js features (Node 22+)
- Built-in fetch instead of external dependencies
- Consistent documentation format

## 8. User Experience

### 8.1 Developer Experience

- Consistent and intuitive API design
- Comprehensive documentation
- Interactive examples and playgrounds
- Clear error messages and debugging support

### 8.2 End-User Experience

- Responsive and intuitive interfaces
- Clear feedback on actions and processes
- Consistent design system
- Accessibility compliance

## 9. Implementation Roadmap

### 9.1 Phase 1: Core Infrastructure (Completed)

- Establish core API structure and patterns
- Implement LLM.do as foundation service
- Create initial Functions.do implementation
- Set up development environments and tools
- Establish zero-dependency SDK architecture
- Implement APIs.do foundation layer

### 9.2 Phase 2: Building Blocks (In Progress)

- Implement Workflows.do core functionality
- Develop Triggers, Searches, and Actions
- Create Database.do implementation
- Establish integration patterns
- Develop SDK packages for npm publication
- Implement comprehensive documentation

### 9.3 Phase 3: Advanced Capabilities (Planned)

- Implement Agents.do framework
- Enhance Functions.do with advanced features
- Develop Evals.do for quality assurance
- Expand integration capabilities
- Implement Events.do for business event tracking
- Develop Experiments.do for iterative improvement

### 9.4 Phase 4: Platform Maturity (Future)

- Optimize performance and scalability
- Enhance developer experience
- Expand documentation and examples
- Implement advanced analytics and monitoring
- Develop Benchmarks.do for model comparison
- Implement Traces.do for debugging
- Create Analytics.do for business impact measurement
- Develop AGI.do for economically valuable work

## 10. Success Metrics

### 10.1 Technical Metrics

- API response times and reliability
- Test coverage and code quality
- Bug resolution times
- System uptime and availability

### 10.2 Business Metrics

- Developer adoption rate
- Integration with business systems
- Reduction in development time for AI applications
- Economic value generated through AI workflows

## 11. Appendices

### 11.1 Technology Stack

- TypeScript: ^5.7.3
- Node.js: ^22.0.0 || >=22.0.0
- Package Manager: pnpm ^9 || ^10
- Next.js: ^15.2.2
- React: ^19.0.0
- React DOM: ^19.0.0
- Payload CMS: ^3.28.1
- MongoDB (via @payloadcms/db-mongodb)
- PostgreSQL (via @payloadcms/db-postgres)
- SQLite (via @payloadcms/db-sqlite)
- Cloudflare Workers (for APIs)
- Hono: ^4.7.4
- Zod: ^3.24.2
- semantic-release: ^19.0.5

### 11.2 Development Tools

- ESLint: ^9.16.0
- Prettier: ^3.4.2
- TypeScript: ^5.7.3
- Wrangler: ^4.2.0
- Vitest: ^1.4.0
- Turborepo: ^2.0.0


### 11.3 Common Commands

- Build: `pnpm build` or `pnpm build:turbo`
- Dev: `pnpm dev` or `pnpm dev:turbo`
- Clean: `pnpm clean:turbo`
- Test: `pnpm test:turbo` (all tests) or `pnpm test -- -t "test pattern"` (in package directory)
- Test watch mode: `pnpm test:watch`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` or `pnpm lint:turbo`
- Format: `pnpm format` or `pnpm prettier-fix`
- Create changeset: `pnpm changeset`
- Version packages: `pnpm changeset version`
- Publish packages: `pnpm changeset publish`
