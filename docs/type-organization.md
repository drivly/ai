# Type Organization Guidelines

This document provides guidelines for organizing TypeScript types across the codebase.

## Criteria for Type Organization

Types should be organized according to the following criteria:

### Shared Types (Central Location)

Types should be placed in central `types` folders when they:

1. **Shared Across Modules**: Are used by multiple unrelated modules
2. **Core Domain Models**: Represent core domain entities (Function, Workflow, Agent, etc.)
3. **Public API Contracts**: Define the interface between the system and its consumers
4. **Stable Interfaces**: Represent stable interfaces unlikely to change frequently

### Co-located Types (With Implementation)

Types should be co-located with their implementation when they:

1. **Single Module Usage**: Are only used within a single module
2. **Implementation Details**: Represent internal implementation details
3. **Component-Specific**: Are specific to a single component's behavior
4. **Experimental**: Are subject to frequent changes during development

## File Organization

1. **Root-level `/types`**: Used for global type declarations and module augmentations
2. **SDK-level `types.ts`**: Core domain models and public API interfaces
3. **Package-level `src/types`**: Internal types used within a specific package
4. **Module-level types**: Co-located with their implementation code

## Best Practices

1. **Avoid Duplication**: Don't duplicate types across the codebase
2. **Clear Naming**: Use descriptive names that indicate the purpose
3. **Consistent Exports**: Use named exports for types (not default exports)
4. **Documentation**: Add JSDoc comments to explain complex types
5. **Import Strategy**: Use explicit imports rather than namespace imports when possible
