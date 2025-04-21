# TODO: ENG-721 - Simplify Resources Embedding Process

## Current Status
- [x] Created README.md with documentation for the batch script
- [x] Created implementation plan in TODO.md (this file)
- [x] Implemented batch script for generating resource embeddings
- [x] Added special handling for problematic resource
- [ ] (Optional) Modified Resources collection's afterChange hook
- [x] Created PR with implementation

## Implementation Plan

### 1. Create Batch Script
- [x] Create `scripts/generateResourceEmbeddingsBatch.ts`
- [x] Implement function to query resources without embeddings
- [x] Add batch processing using `embedMany` from AI SDK
- [x] Implement special handling for problematic resource ID (67dd4e7ec37e99e7ed48ffa2)
- [x] Add direct database updates with generated embeddings
- [x] Implement error handling and logging
- [x] Make batch size configurable

### 2. (Optional) Modify Resources Collection
- [ ] Update `collections/data/Resources.ts` to disable direct embedding generation
- [ ] Add flag to control embedding generation behavior
- [ ] Ensure backward compatibility

### 3. Testing
- [ ] Test script with default batch size
- [ ] Test script with custom batch size
- [ ] Verify special handling for problematic resource
- [ ] Ensure error handling works correctly

### 4. Documentation
- [x] Create/update README.md with usage instructions
- [x] Add inline comments to explain key parts of the code
- [x] Document cron job setup

## Technical Challenges
- Ensuring proper error handling for batch processing
- Handling the problematic resource that causes write conflicts
- Balancing batch size for optimal performance

## Verification Requirements
- Script successfully generates embeddings for resources without them
- Special handling for problematic resource works correctly
- No write conflicts occur during batch processing
- Script can be run as a standalone process for cron scheduling
