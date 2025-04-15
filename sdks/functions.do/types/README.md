# Functions.do SDK Types

This folder contains the TypeScript type definitions for the Functions.do SDK.

## Organization

The types in this SDK follow these organization principles:

1. **Function Definition Types**: Types that define the structure and behavior of AI functions.
2. **Schema Types**: Types for function input/output schema definition and transformation.
3. **Helper Types**: Utility types to support function creation and execution.

## Types Overview

- **AIFunction**: Core type for AI function definition
- **AIConfig**: Configuration options for AI functions
- **SchemaToOutput**: Helper type to convert schemas to output types

## When to Add Types Here

- Add types here if they directly relate to function definition or execution
- Add types here if they are part of the public API contract
- Add types here if they are used by other SDKs that depend on functions.do

## When to Use Co-located Types Instead

- If a type is only used within a specific component of the SDK
- If a type is an implementation detail rather than part of the public API
- If a type is experimental or subject to frequent changes
