# Workflows.do SDK Types

This folder contains the TypeScript type definitions for the Workflows.do SDK.

## Organization

The types in this SDK follow these organization principles:

1. **Workflow Definition Types**: Types that define the structure of workflows and steps.
2. **Execution Types**: Types related to workflow execution and context.
3. **Integration Types**: Types for connecting workflows with external systems and functions.

## Types Overview

- **Workflow**: Core type for workflow definition
- **WorkflowStep**: Definition of a single step in a workflow
- **WorkflowContext**: Execution context for a workflow
- **WorkflowExecutionResult**: Result of workflow execution

## When to Add Types Here

- Add types here if they directly relate to workflow definition or execution
- Add types here if they are part of the public API contract
- Add types here if they are used by other SDKs that depend on workflows.do

## When to Use Co-located Types Instead

- If a type is only used within a specific component of the SDK
- If a type is an implementation detail rather than part of the public API
- If a type is experimental or subject to frequent changes
