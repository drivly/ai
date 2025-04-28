# TODO: ENG-799 - Ensure `functions.do` and `ai-functions` have the same interface

## Current Status

- [x] Analyzed interfaces of both packages
- [x] Documented interface differences
- [ ] Implemented changes to align interfaces
- [ ] Updated tests to verify compatibility
- [ ] Released updated packages

## Interface Differences

### Type Definitions

#### AIConfig Interface
- [x] Both packages have similar AIConfig interfaces with model, system, temperature, seed, and schema properties
- [ ] Ensure consistent property types and defaults across both packages

#### AIProxy Type
- [ ] functions.do has a more complex AIProxy type with additional template literal functionality
- [ ] ai-functions has a simpler AIProxy implementation
- [ ] Decide on unified AIProxy interface that supports all use cases

#### SchemaToOutput Type Helper
- [x] Both packages have identical SchemaToOutput type helpers
- [ ] Ensure consistent behavior for complex nested schemas

#### DatabaseAccess Interface
- [ ] functions.do imports DatabaseClient from database.do
- [ ] ai-functions defines its own DatabaseAccess interface with specific methods
- [ ] Standardize on a single DatabaseAccess interface

### Function Patterns

#### Template Literals
- [ ] functions.do implements template literals via taggedTemplateFunction
- [ ] ai-functions implements template literals in aiHandler.apply
- [ ] Standardize template literal implementation

#### Schema-Based Function Calls
- [ ] functions.do uses createFunction and createDynamicFunction for schema validation
- [ ] ai-functions uses Zod schemas for validation
- [ ] Decide on schema validation approach (custom vs Zod)

#### Direct Function Calls
- [ ] functions.do supports multiple function call patterns through dynamic proxies
- [ ] ai-functions has simpler function call implementation
- [ ] Standardize function call patterns

### Additional Functions

#### Markdown Generation
- [ ] functions.do has generateMarkdown function
- [ ] ai-functions has markdown function with different implementation
- [ ] Standardize on a single markdown generation approach

#### List Generation
- [ ] ai-functions has list function for generating arrays
- [ ] functions.do lacks equivalent functionality
- [ ] Add list function to functions.do or remove from ai-functions

#### Research Function
- [ ] functions.do has research function
- [ ] ai-functions lacks equivalent functionality
- [ ] Add research function to ai-functions or remove from functions.do

### Schema Handling

- [ ] functions.do uses custom schema validation with determineIfSchema
- [ ] ai-functions uses Zod for schema validation
- [ ] Decide on schema validation approach (custom vs Zod)

## Design Decisions

### 1. Schema Validation Approach

- [ ] **Option A**: Use custom schema validation (functions.do approach)
  - Pros: No external dependencies, simpler implementation
  - Cons: Less robust validation, fewer features

- [ ] **Option B**: Use Zod for schema validation (ai-functions approach)
  - Pros: More robust validation, better type inference
  - Cons: Additional dependency, more complex implementation

### 2. API Integration Strategy

- [ ] **Option A**: Direct API calls (functions.do approach)
  - Pros: Simpler implementation, fewer dependencies
  - Cons: Less flexibility, harder to switch providers

- [ ] **Option B**: Use providers through ai-providers (ai-functions approach)
  - Pros: More flexible, easier to switch providers
  - Cons: Additional dependency, more complex implementation

### 3. Function Naming Conventions

- [ ] **Option A**: Use verb-noun format (generateMarkdown)
  - Pros: More descriptive, clearer intent
  - Cons: Longer names, less concise

- [ ] **Option B**: Use noun format (markdown)
  - Pros: More concise, simpler API
  - Cons: Less descriptive, less clear intent

### 4. Type Definition Complexity

- [ ] **Option A**: More complex types with multiple patterns (functions.do approach)
  - Pros: More flexible, supports more use cases
  - Cons: Harder to understand, more complex implementation

- [ ] **Option B**: Simpler types with fewer patterns (ai-functions approach)
  - Pros: Easier to understand, simpler implementation
  - Cons: Less flexible, supports fewer use cases

### 5. Long-term Package Relationship

- [ ] **Option A**: Maintain separate packages with aligned interfaces
  - Pros: More flexibility, easier to maintain
  - Cons: Duplication of code, potential for divergence

- [ ] **Option B**: Merge packages into a single unified package
  - Pros: No duplication, consistent interface
  - Cons: Less flexibility, harder to maintain

### 6. Feature Prioritization

- [ ] **Option A**: Implement all features in both packages
  - Pros: Full feature parity, consistent experience
  - Cons: More complex, harder to maintain

- [ ] **Option B**: Implement core features only, with package-specific extensions
  - Pros: Simpler core, more focused packages
  - Cons: Less consistency, more complex documentation

## Implementation Plan

### 1. Align Type Definitions

- [ ] Standardize AIConfig interface
- [ ] Decide on AIProxy implementation
- [ ] Ensure SchemaToOutput helper is consistent
- [ ] Standardize DatabaseAccess interface

### 2. Align Function Patterns

- [ ] Standardize template literal implementation
- [ ] Decide on schema validation approach
- [ ] Implement consistent function call patterns

### 3. Align Additional Functions

- [ ] Standardize markdown generation
- [ ] Decide on list function implementation
- [ ] Decide on research function implementation

### 4. Update Tests

- [ ] Update tests to verify compatibility
- [ ] Ensure all function patterns are tested
- [ ] Test edge cases and error handling

### 5. Update Documentation

- [ ] Update README files
- [ ] Document interface changes
- [ ] Provide migration guide if needed

### 6. Release Updated Packages

- [ ] Release updated packages
- [ ] Update dependencies
- [ ] Communicate changes to users
