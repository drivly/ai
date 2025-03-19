# llm.do SDK

llm.do is a plugin-based set of tools that wraps and retrofits AI SDKs and providers. This helps developers future-proof their AI models and workflows.

## AI Layer

- Virtual model
  - Chooses concrete AI model based on input
- Threads
  - Messages
- Tools
  - Built-in
    - Image generation
    - Web search
    - File search
    - Computer use
  - Served
    - MCP
  - Handoffs
    - Workflow Orchestration
    - Subtasks
  - Local
    - Pre-built
    - Custom
- `Generate`/`Stream`
  - `messages` OR `thread`
  - `instructions`
  - `tools`
  - `model`
  - `effort`
  - `maxSteps`
  - `schema`

## Agent Layer

- Agent
  - Role
  - Instructions
  - Chain-of-Draft Examples
  - Guardrails
  - Tools, Model, Effort, Max Steps
  - `Run`
    - `context`
    - `question`
    - `messages` OR `thread`
- Workflows
  - Status
    - Function
    - Transitions
      - Guards
      - Function
  - Events
  - `Run`
