# Types Organization

This directory contains TypeScript type declarations and module augmentations for external libraries used across the codebase.

## Purpose

The root-level `types` folder serves the following purposes:

1. **External Module Declarations**: Contains `.d.ts` files that define or augment types for external libraries that don't have their own type definitions or need customization.
2. **Global Type Declarations**: Defines global types that are used across multiple packages and modules.

## Organization Guidelines

Types in this repository follow a hybrid organization approach:

### Central Types (in this folder)

- Module declaration files (`.d.ts`) for external libraries
- Global type definitions used across multiple packages

### SDK-level Types (`sdks/[sdk-name]/types.ts`)

- Core domain models related to the specific SDK
- Public API interfaces for the SDK
- Types that define the contract between the SDK and its consumers

### Package-level Types (`pkgs/[pkg-name]/src/types`)

- Internal types used within a specific package
- Configuration types and internal interfaces
- Types specific to the package implementation

### Co-located Types

- Types used by only one component should be defined alongside that component
- Helper types and utility types specific to a module should be defined within that module

## Best Practices

1. **Shared vs. Specific**: If a type is used by multiple modules or packages, it should be centralized. If it's specific to one module, it should be co-located.
2. **Export Patterns**: Use named exports for types and avoid default exports for better import clarity.
3. **Documentation**: Add JSDoc comments to explain complex types and relationships.
4. **Naming Conventions**: Use PascalCase for interface and type names; use camelCase for properties.
