# AI Folder Sync Implementation (ENG-171)

## Current Implementation Progress
- [ ] Create GitHub file operations task
  - [ ] Implement read operation
  - [ ] Implement write operation
  - [ ] Implement delete operation
  - [ ] Implement list operation
- [ ] Create database model for synced files
- [ ] Enhance SDK CLIs with sync functionality
  - [ ] Update apis.do CLI
  - [ ] Update workflows.do CLI
- [ ] Extend config schema to support sync modes
- [ ] Implement core sync logic
  - [ ] Database as source of truth
  - [ ] Local files as source of truth
  - [ ] GitHub as source of truth
- [ ] Add file change detection mechanism
- [ ] Update CLI command handling in bin.ts files

## Technical Challenges and Blockers
- [ ] Ensure GitHub App has appropriate permissions
- [ ] Handle conflict resolution between different sources of truth
- [ ] Implement efficient file change detection

## Verification Requirements
- [ ] Test CLI commands locally for all three sync modes
- [ ] Verify file changes are properly detected and synced
- [ ] Test conflict resolution in each mode
- [ ] Verify database model creation and updates
- [ ] Check that the config schema is correctly extended and used
- [ ] Test partial syncs with specific resources

## Deployment Status
- [ ] Create PR with implementation
- [ ] Include Linear ticket ID (ENG-171) in PR description
- [ ] Ensure CI passes
