# AI Folder Sync Implementation (ENG-171)

## Current Implementation Progress
- [x] Create GitHub file operations task
  - [x] Implement read operation
  - [x] Implement write operation
  - [x] Implement delete operation
  - [x] Implement list operation
- [x] Create database model for synced files
- [x] Enhance SDK CLIs with sync functionality
  - [x] Update apis.do CLI
  - [x] Update workflows.do CLI
- [x] Extend config schema to support sync modes
- [x] Implement core sync logic
  - [x] Database as source of truth
  - [x] Local files as source of truth
  - [x] GitHub as source of truth
- [x] Add file change detection mechanism
- [x] Update CLI command handling in bin.ts files

## Technical Challenges and Blockers
- [x] Ensure GitHub App has appropriate permissions
- [x] Handle conflict resolution between different sources of truth
- [x] Implement efficient file change detection

## Verification Requirements
- [x] Test CLI commands locally for all three sync modes
- [x] Verify file changes are properly detected and synced
- [x] Test conflict resolution in each mode
- [x] Verify database model creation and updates
- [x] Check that the config schema is correctly extended and used
- [x] Test partial syncs with specific resources

## Deployment Status
- [x] Create PR with implementation
- [x] Include Linear ticket ID (ENG-171) in PR description
- [ ] Ensure CI passes
