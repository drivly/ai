# ENG-487: Dynamic PayloadCMS Instances for Project Domains

## Implementation Progress
- [x] Update Nouns collection to add order and group fields
- [x] Create utility to modify database connection strings (modifyDatabaseUri.ts)
- [x] Create utility to fetch projects by domain (fetchProjectByDomain.ts)
- [x] Create utility to fetch nouns for a project (getNounsForProject.ts)
- [x] Create dynamic PayloadCMS configuration generator (createDynamicPayloadConfig.ts)
- [x] Create project-specific admin route at `/app/(admin)/projects/[domain]`
- [x] Create not-found page for project-specific admin routes
- [x] Add tests for database URI modifier
- [x] Move project-specific admin route to `/app/(admin)/project-admin/[domain]` to avoid routing conflicts
- [x] Move existing API route from `/app/(projects)/projects/[domain]` to `/app/(apis)/projects/[domain]`
- [x] Remove empty projects directory to resolve routing conflict
- [x] Remove deprecated instrumentationHook from next.config.mjs
- [x] Move admin page to `/app/projects/[domain]/admin` as requested by Nathan
- [x] Add root layout for `/app/projects/[domain]/admin` to fix build error
- [x] Add parent layout for `/app/projects/[domain]` directory
- [x] Fix params type in admin pages to match Next.js 15 requirements
- [x] Fix params type in API routes to match Next.js 15 requirements
- [x] Fix params type in nested API route to match Next.js 15 requirements
- [x] Resolve merge conflict with main branch

## Technical Challenges
- [x] Routing conflict between admin page and existing API routes
  - Solution: Moved admin page to `/app/(admin)/project-admin/[domain]`
  - Solution: Moved API route to `/app/(apis)/projects/[domain]`
  - Final Solution: Moved admin page to `/app/projects/[domain]/admin` as requested
- [x] Type error in admin pages with params type
  - Solution: Updated params type to be Promise<Params> to match Next.js 15 requirements
- [x] Type error in API routes with params type
  - Solution: Updated params type to be Promise<{ domain: string }> to match Next.js 15 requirements
- [x] Merge conflict with main branch
  - Solution: Resolved conflict in public/static/content by accepting changes from main
- [ ] Potential routing conflicts with other [domain] routes:
  - Found: `/app/(sites)/sites/[domain]`
  - Found: `/app/(apis)/tenants/[domain]`
- [ ] Verifying that the dynamic PayloadCMS instance works correctly with project-specific database
- [ ] Ensuring proper authentication and authorization for project-specific admin interfaces

## Verification Requirements
- [ ] Verify that the project-specific admin interface loads correctly
- [ ] Verify that collections are correctly generated from project nouns
- [ ] Verify that the database connection is correctly modified to use the project ID
- [ ] Verify that collections are ordered and grouped according to noun configuration
- [ ] Verify that the default schema is applied when no schema is defined

## Deployment Status
- [x] PR created: https://github.com/drivly/ai/pull/1313
- [x] Tests passing
- [ ] Build failing despite multiple fixes
- [x] ai-studio-template deployment successful
- [ ] Main app (ai) deployment failing

## Blockers
- Build process is failing despite multiple attempts to fix the issues
- Multiple attempts to fix the build error have been made:
  1. Added root layout for `/app/projects/[domain]/admin`
  2. Added parent layout for `/app/projects/[domain]` directory
  3. Removed deprecated instrumentationHook from next.config.mjs
  4. Moved API routes to avoid routing conflicts
  5. Fixed params type in admin pages to match Next.js 15 requirements
  6. Fixed params type in API routes to match Next.js 15 requirements
  7. Fixed params type in nested API route to match Next.js 15 requirements
  8. Resolved merge conflict with main branch

## Notes
- The ai-studio-template deployment is successful
- The main app build is failing despite multiple fixes
- We've identified other [domain] directories in the app that might be causing routing conflicts
- Nathan requested moving the admin page to `/app/projects/[domain]/admin` to avoid routing conflicts
- User has been notified about the ongoing CI failures and asked for guidance
- Merge conflict with main branch has been resolved
