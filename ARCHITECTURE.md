# AI Primitives Platform Architecture

This document provides an overview of the AI Primitives platform architecture, explaining the major components, their relationships, and how they work together to deliver economically valuable work through simple APIs.

## System Overview

The AI Primitives platform is a comprehensive framework for building enterprise-grade AI applications. It provides composable building blocks that enable developers to create, deploy, and manage AI functions, workflows, and autonomous agents.

```mermaid
graph TD
    subgraph "Core Primitives"
        Functions["Functions.do<br/>Strongly-typed composable<br/>building blocks"]
        Workflows["Workflows.do<br/>Declarative state machines<br/>for orchestration"]
        Agents["Agents.do<br/>Autonomous digital workers"]
    end

    subgraph "Event System"
        Triggers["Triggers.do<br/>Initiate workflows<br/>based on events"]
        Searches["Searches.do<br/>Query and retrieve data"]
        Actions["Actions.do<br/>Perform tasks<br/>within workflows"]
    end

    subgraph "Foundation Components"
        LLM["LLM.do<br/>AI gateway for routing<br/>requests to optimal models"]
        Database["Database.do<br/>Persistent data storage<br/>with Payload CMS"]
        Evals["Evals.do<br/>Evaluation tools<br/>for AI components"]
        Integrations["Integrations.do<br/>Connectors for<br/>external systems"]
    end

    subgraph "API Gateway"
        APIs["APIs.do<br/>Unified gateway for<br/>accessing all services"]
    end

    APIs --> Functions
    APIs --> Workflows
    APIs --> Agents
    APIs --> Triggers
    APIs --> Searches
    APIs --> Actions
    APIs --> LLM
    APIs --> Database
    APIs --> Evals
    APIs --> Integrations

    Workflows --> Functions
    Agents --> Functions
    Agents --> Workflows

    Triggers --> Workflows
    Actions --> Workflows
    Searches --> Workflows

    Functions --> LLM
    Workflows --> LLM
    Agents --> LLM

    Functions --> Database
    Workflows --> Database
    Agents --> Database
```

## Core Primitives

### Functions.do - Inputs to Structured Outputs

Functions.do provides strongly-typed composable building blocks for AI applications. These functions take inputs and produce structured outputs, making them easy to compose into more complex workflows.

```mermaid
graph LR
    Input[Input]
    LLM[Language Model]
    Schema[Output Schema]
    Output[Structured Output]
    
    Input --> LLM
    LLM --> Schema
    Schema --> Output
    
    style Input fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Output fill:#f9f9f9,stroke:#333,stroke-width:1px
    style LLM fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Schema fill:#d4f9d4,stroke:#333,stroke-width:1px
```

Key characteristics:
- Strongly-typed inputs and outputs
- Support for various output schemas
- Cached responses for improved performance
- Detailed generation tracking for observability

### Workflows.do - Business-as-Code

Workflows.do provides declarative state machines for orchestrating functions and other components. Workflows enable complex business processes to be defined and executed reliably.

```mermaid
graph TD
    Event[Event] --> Trigger[Trigger]
    Trigger --> Workflow[Workflow]
    Workflow --> Function1[Function 1]
    Workflow --> Function2[Function 2]
    Workflow --> Function3[Function 3]
    Function1 --> Action1[Action]
    Function2 --> Search[Search]
    Function3 --> Action2[Action]
    
    style Event fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Trigger fill:#ffd966,stroke:#333,stroke-width:1px
    style Workflow fill:#d9d2e9,stroke:#333,stroke-width:1px
    style Function1 fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Function2 fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Function3 fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Action1 fill:#ead1dc,stroke:#333,stroke-width:1px
    style Search fill:#d9ead3,stroke:#333,stroke-width:1px
    style Action2 fill:#ead1dc,stroke:#333,stroke-width:1px
```

Key characteristics:
- Event-driven execution
- State management
- Error handling and retries
- Integration with external systems

### Agents.do - Autonomous Digital Workers

Agents.do combines functions and workflows to create autonomous digital workers that can perform complex tasks with minimal human intervention.

```mermaid
graph TD
    Agent[Agent] --> Goals[Goals]
    Agent --> Memory[Memory]
    Agent --> Tools[Tools]
    Tools --> Function1[Function 1]
    Tools --> Function2[Function 2]
    Tools --> Workflow1[Workflow 1]
    Tools --> ExternalAPI[External API]
    
    style Agent fill:#e6e6fa,stroke:#333,stroke-width:1px
    style Goals fill:#fff2cc,stroke:#333,stroke-width:1px
    style Memory fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Tools fill:#f4cccc,stroke:#333,stroke-width:1px
    style Function1 fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Function2 fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Workflow1 fill:#d9d2e9,stroke:#333,stroke-width:1px
    style ExternalAPI fill:#ead1dc,stroke:#333,stroke-width:1px
```

Key characteristics:
- Goal-oriented behavior
- Memory and context management
- Access to tools and workflows
- Autonomous decision making

## Event System

### Triggers.do - Start Business Processes

Triggers.do enables workflows to be initiated based on events from various sources, such as API calls, webhooks, or scheduled tasks.

```mermaid
graph LR
    WebhookEvent[Webhook Event] --> TriggerHandler[Trigger Handler]
    ScheduledEvent[Scheduled Event] --> TriggerHandler
    APIEvent[API Event] --> TriggerHandler
    ExternalEvent[External Integration Event] --> TriggerHandler
    TriggerHandler --> Workflow[Workflow]
    
    style WebhookEvent fill:#f9f9f9,stroke:#333,stroke-width:1px
    style ScheduledEvent fill:#f9f9f9,stroke:#333,stroke-width:1px
    style APIEvent fill:#f9f9f9,stroke:#333,stroke-width:1px
    style ExternalEvent fill:#f9f9f9,stroke:#333,stroke-width:1px
    style TriggerHandler fill:#ffd966,stroke:#333,stroke-width:1px
    style Workflow fill:#d9d2e9,stroke:#333,stroke-width:1px
```

### Searches.do - Provide Context & Understanding

Searches.do provides query capabilities for retrieving data from various sources, providing context and understanding for workflows and agents.

```mermaid
graph TD
    Query[Query] --> SearchRouter[Search Router]
    SearchRouter --> Database[Database Search]
    SearchRouter --> Vector[Vector Search]
    SearchRouter --> External[External API Search]
    SearchRouter --> LLM[LLM-augmented Search]
    Database --> Results[Search Results]
    Vector --> Results
    External --> Results
    LLM --> Results
    
    style Query fill:#f9f9f9,stroke:#333,stroke-width:1px
    style SearchRouter fill:#d9ead3,stroke:#333,stroke-width:1px
    style Database fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Vector fill:#d0e0e3,stroke:#333,stroke-width:1px
    style External fill:#d0e0e3,stroke:#333,stroke-width:1px
    style LLM fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Results fill:#f9f9f9,stroke:#333,stroke-width:1px
```

### Actions.do - Impact the External World

Actions.do enables workflows and agents to perform tasks that impact the external world, such as sending emails, creating issues, or updating records.

```mermaid
graph LR
    Workflow[Workflow] --> ActionHandler[Action Handler]
    ActionHandler --> Email[Send Email]
    ActionHandler --> Issue[Create Issue]
    ActionHandler --> Record[Update Record]
    ActionHandler --> API[Call External API]
    
    style Workflow fill:#d9d2e9,stroke:#333,stroke-width:1px
    style ActionHandler fill:#ead1dc,stroke:#333,stroke-width:1px
    style Email fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Issue fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Record fill:#f9f9f9,stroke:#333,stroke-width:1px
    style API fill:#f9f9f9,stroke:#333,stroke-width:1px
```

## Foundation Components

### LLM.do - Intelligent AI Gateway

LLM.do serves as an intelligent gateway for routing AI requests to the optimal language models based on capabilities and requirements.

```mermaid
graph TD
    Request[AI Request] --> ModelSelector[Model Selector]
    ModelSelector --> OpenAI[OpenAI Models]
    ModelSelector --> Anthropic[Anthropic Models]
    ModelSelector --> Composite[Composite Models]
    ModelSelector --> Custom[Custom Models]
    OpenAI --> Response[AI Response]
    Anthropic --> Response
    Composite --> Response
    Custom --> Response
    
    style Request fill:#f9f9f9,stroke:#333,stroke-width:1px
    style ModelSelector fill:#d4f1f9,stroke:#333,stroke-width:1px
    style OpenAI fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Anthropic fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Composite fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Custom fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Response fill:#f9f9f9,stroke:#333,stroke-width:1px
```

Key capabilities:
- Model selection based on capabilities
- Load balancing and fallbacks
- Integrated tool use
- Observability and analytics

### Database.do - AI-enriched Data

Database.do provides persistent data storage with AI-enriched capabilities, built on Payload CMS.

```mermaid
graph LR
    Application[Application] --> DatabaseAPI[Database API]
    DatabaseAPI --> CRUD[CRUD Operations]
    DatabaseAPI --> AIEnrichment[AI Enrichment]
    DatabaseAPI --> Search[Search]
    CRUD --> PayloadCMS[Payload CMS]
    AIEnrichment --> PayloadCMS
    Search --> PayloadCMS
    
    style Application fill:#f9f9f9,stroke:#333,stroke-width:1px
    style DatabaseAPI fill:#d0e0e3,stroke:#333,stroke-width:1px
    style CRUD fill:#d0e0e3,stroke:#333,stroke-width:1px
    style AIEnrichment fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Search fill:#d0e0e3,stroke:#333,stroke-width:1px
    style PayloadCMS fill:#d0e0e3,stroke:#333,stroke-width:1px
```

### Evals.do - Measure & Improve

Evals.do provides evaluation tools for AI components, enabling continuous improvement and quality assurance.

```mermaid
graph TD
    Function[Function] --> Evaluator[Evaluator]
    Dataset[Dataset] --> Evaluator
    Metrics[Metrics] --> Evaluator
    Evaluator --> Results[Evaluation Results]
    Results --> Benchmarks[Benchmarks]
    
    style Function fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Dataset fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Metrics fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Evaluator fill:#fff2cc,stroke:#333,stroke-width:1px
    style Results fill:#f9f9f9,stroke:#333,stroke-width:1px
    style Benchmarks fill:#f9f9f9,stroke:#333,stroke-width:1px
```

### Integrations.do - Connect External Systems

Integrations.do provides connectors for external systems, enabling seamless integration with third-party services.

```mermaid
graph TD
    Application[Application] --> IntegrationsAPI[Integrations API]
    IntegrationsAPI --> GitHub[GitHub]
    IntegrationsAPI --> Slack[Slack]
    IntegrationsAPI --> Email[Email]
    IntegrationsAPI --> Custom[Custom Integrations]
    
    style Application fill:#f9f9f9,stroke:#333,stroke-width:1px
    style IntegrationsAPI fill:#ead1dc,stroke:#333,stroke-width:1px
    style GitHub fill:#ead1dc,stroke:#333,stroke-width:1px
    style Slack fill:#ead1dc,stroke:#333,stroke-width:1px
    style Email fill:#ead1dc,stroke:#333,stroke-width:1px
    style Custom fill:#ead1dc,stroke:#333,stroke-width:1px
```

## API Gateway

### APIs.do - Clickable Developer Experiences

APIs.do provides a unified gateway for accessing all platform services through simple, clickable APIs.

```mermaid
graph TD
    Client[Client] --> APIGateway[API Gateway]
    APIGateway --> Auth[Authentication & Authorization]
    APIGateway --> Router[Request Router]
    Router --> CoreAPIs[Core APIs]
    Router --> EventAPIs[Event APIs]
    Router --> FoundationAPIs[Foundation APIs]
    CoreAPIs --> Functions[Functions.do]
    CoreAPIs --> Workflows[Workflows.do]
    CoreAPIs --> Agents[Agents.do]
    EventAPIs --> Triggers[Triggers.do]
    EventAPIs --> Searches[Searches.do]
    EventAPIs --> Actions[Actions.do]
    FoundationAPIs --> LLM[LLM.do]
    FoundationAPIs --> Database[Database.do]
    FoundationAPIs --> Evals[Evals.do]
    FoundationAPIs --> Integrations[Integrations.do]
    
    style Client fill:#f9f9f9,stroke:#333,stroke-width:1px
    style APIGateway fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Auth fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Router fill:#cfe2f3,stroke:#333,stroke-width:1px
    style CoreAPIs fill:#cfe2f3,stroke:#333,stroke-width:1px
    style EventAPIs fill:#cfe2f3,stroke:#333,stroke-width:1px
    style FoundationAPIs fill:#cfe2f3,stroke:#333,stroke-width:1px
```

## Data Flow Architecture

The following diagram illustrates the high-level data flow in the AI Primitives platform:

```mermaid
graph TD
    Client[Client] --> APIGateway[API Gateway]
    APIGateway --> Workflow[Workflow]
    APIGateway --> Function[Function]
    APIGateway --> Agent[Agent]
    Workflow --> Function
    Agent --> Function
    Agent --> Workflow
    Function --> LLM[LLM Service]
    Function --> Database[Database]
    Workflow --> Trigger[Trigger]
    Workflow --> Search[Search]
    Workflow --> Action[Action]
    Search --> Database
    Search --> ExternalData[External Data Source]
    Action --> ExternalSystem[External System]
    
    style Client fill:#f9f9f9,stroke:#333,stroke-width:1px
    style APIGateway fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Workflow fill:#d9d2e9,stroke:#333,stroke-width:1px
    style Function fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Agent fill:#e6e6fa,stroke:#333,stroke-width:1px
    style LLM fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Database fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Trigger fill:#ffd966,stroke:#333,stroke-width:1px
    style Search fill:#d9ead3,stroke:#333,stroke-width:1px
    style Action fill:#ead1dc,stroke:#333,stroke-width:1px
    style ExternalData fill:#f9f9f9,stroke:#333,stroke-width:1px
    style ExternalSystem fill:#f9f9f9,stroke:#333,stroke-width:1px
```

## Deployment Architecture

The AI Primitives platform leverages modern deployment paradigms for scalability and reliability:

```mermaid
graph TD
    subgraph "Client"
        Browser[Browser]
        SDK[SDK]
    end

    subgraph "Edge Network"
        CDN[CDN]
        EdgeFunctions[Edge Functions]
    end

    subgraph "API Layer"
        APIGateway[API Gateway]
        Auth[Authentication]
        Routing[Routing]
    end

    subgraph "Service Layer"
        Services[Microservices]
        Workers[Background Workers]
    end

    subgraph "Data Layer"
        Database[Database]
        BlobStorage[Blob Storage]
        Cache[Cache]
    end

    subgraph "External Services"
        LLMProviders[LLM Providers]
        ThirdPartyAPIs[Third-Party APIs]
    end

    Browser --> CDN
    SDK --> EdgeFunctions
    CDN --> EdgeFunctions
    EdgeFunctions --> APIGateway
    APIGateway --> Auth
    APIGateway --> Routing
    Routing --> Services
    Services --> Workers
    Services --> Database
    Services --> BlobStorage
    Services --> Cache
    Services --> LLMProviders
    Services --> ThirdPartyAPIs
    Workers --> Database
    Workers --> BlobStorage
    Workers --> LLMProviders
    Workers --> ThirdPartyAPIs
    
    style Browser fill:#f9f9f9,stroke:#333,stroke-width:1px
    style SDK fill:#f9f9f9,stroke:#333,stroke-width:1px
    style CDN fill:#d5a6bd,stroke:#333,stroke-width:1px
    style EdgeFunctions fill:#d5a6bd,stroke:#333,stroke-width:1px
    style APIGateway fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Auth fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Routing fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Services fill:#c9daf8,stroke:#333,stroke-width:1px
    style Workers fill:#c9daf8,stroke:#333,stroke-width:1px
    style Database fill:#d0e0e3,stroke:#333,stroke-width:1px
    style BlobStorage fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Cache fill:#d0e0e3,stroke:#333,stroke-width:1px
    style LLMProviders fill:#d9d2e9,stroke:#333,stroke-width:1px
    style ThirdPartyAPIs fill:#d9d2e9,stroke:#333,stroke-width:1px
```

## Repository Structure

The AI Primitives platform is organized as a monorepo using pnpm workspaces:

```mermaid
graph TD
    Root["/"] --> App["app/"]
    Root --> Collections["collections/"]
    Root --> Components["components/"]
    Root --> Content["content/"]
    Root --> Lib["lib/"]
    Root --> Packages["pkgs/"]
    Root --> Web["web/"]
    Root --> Workers["workers/"]
    Root --> Workflows["workflows/"]
    
    App --> WebsitesApp["app/(websites)/"]
    App --> APIsApp["app/(apis)/"]
    App --> PayloadApp["app/(payload)/"]
    
    Collections --> AICollections["collections/ai/"]
    Collections --> DataCollections["collections/data/"]
    Collections --> EventsCollections["collections/events/"]
    Collections --> ObservabilityCollections["collections/observability/"]
    
    Packages --> AIModels["pkgs/ai-models/"]
    Packages --> DeployWorker["pkgs/deploy-worker/"]
    Packages --> ClickableLinks["pkgs/clickable-links/"]
    
    style Root fill:#f9f9f9,stroke:#333,stroke-width:1px
    style App fill:#d5a6bd,stroke:#333,stroke-width:1px
    style Collections fill:#d0e0e3,stroke:#333,stroke-width:1px
    style Components fill:#c9daf8,stroke:#333,stroke-width:1px
    style Content fill:#d9ead3,stroke:#333,stroke-width:1px
    style Lib fill:#d9d2e9,stroke:#333,stroke-width:1px
    style Packages fill:#ffd966,stroke:#333,stroke-width:1px
    style Web fill:#cfe2f3,stroke:#333,stroke-width:1px
    style Workers fill:#ead1dc,stroke:#333,stroke-width:1px
    style Workflows fill:#d4f1f9,stroke:#333,stroke-width:1px
```

Key directories:
- `/app/`: Next.js application components
- `/collections/`: Payload CMS collection definitions
- `/components/`: Shared UI components
- `/content/`: MDX content files
- `/lib/`: Shared utility functions
- `/pkgs/`: Shared packages (monorepo)
- `/web/`: Website implementations
- `/workers/`: Cloudflare Workers implementations
- `/workflows/`: Workflow definitions and examples
