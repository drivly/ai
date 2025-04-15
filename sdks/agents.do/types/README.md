# Agents.do SDK Types

This folder contains the TypeScript type definitions for the Agents.do SDK.

## Organization

The types in this SDK follow these organization principles:

1. **Agent Definition Types**: Types that define the structure and behavior of AI agents.
2. **Execution Types**: Types related to agent execution and responses.
3. **Configuration Types**: Types for configuring agent behavior and capabilities.

## Types Overview

- **Agent**: Core type for agent definition
- **AgentConfig**: Configuration options for agent behavior
- **AgentResponse**: Structure of agent responses
- **AgentContext**: Execution context for an agent

## When to Add Types Here

- Add types here if they directly relate to agent definition or execution
- Add types here if they are part of the public API contract
- Add types here if they are used by other SDKs that depend on agents.do

## When to Use Co-located Types Instead

- If a type is only used within a specific component of the SDK
- If a type is an implementation detail rather than part of the public API
- If a type is experimental or subject to frequent changes
