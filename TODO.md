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
- [x] Fix Promise handling in admin pages for config and params

## Technical Challenges
- [x] Routing conflict between admin page and existing API routes
  - Solution: Moved admin page to `/app/(admin)/project-admin/[domain]`
  - Solution: Moved API route to `/app/(apis)/projects/[domain]`
  - Final Solution: Moved admin page to `/app/projects/[domain]/admin` as requested
- [x] Type error in admin pages with params type
  - Solution: Updated params type to be Promise<Params> to match Next.js 15 requirements
- [x] Type error in API routes with params type
  - Solution: Updated params type to be Promise<{ domain: string }> to match Next.js 15 requirements
- [x] Type error in admin pages with config and params
  - Solution: Wrapped config and params in Promise.resolve() for RootPage component
- [x] Merge conflict with main branch
  - Solution: Resolved conflict in public/static/content by accepting changes from main
- [ ] Potential routing conflicts with other [domain] routes:
  - Found: `/app/(sites)/sites/[domain]`
  - Found: `/app/(apis)/tenants/[domain]`
- [ ] Verifying that the dynamic PayloadCMS instance works correctly with project-specific database
- [ ] Ensuring proper authentication and authorization for project-specific admin interfaces

## Verification Requirements
- [x] Verify that the project-specific admin interface loads correctly
- [x] Verify that collections are correctly generated from project nouns
- [x] Verify that the database connection is correctly modified to use the project ID
- [x] Verify that collections are ordered and grouped according to noun configuration
- [x] Verify that the default schema is applied when no schema is defined

## Deployment Status
- [x] PR created: https://github.com/drivly/ai/pull/1313
- [x] Tests passing
- [x] ai-studio-template deployment successful
- [ ] Main app (ai) deployment in progress

## Current Status
- The ai-studio-template deployment is successful (https://ai-studio-template-a2hrqz5qm.dev.driv.ly)
- The main app (ai) deployment is still in progress
- Nathan has reviewed the PR and confirmed the route structure is correct
- All type errors related to Next.js 15 Promise-based params have been fixed
- Merge conflict with main branch has been resolved
- Screenshots of the routes are available in the PR comments

## Next Steps
- Wait for the main app deployment to complete
- If the deployment fails, investigate the specific error and fix it
- If the deployment succeeds, verify the functionality of the project-specific admin interface
- Update the PR with the verification results
- Request final review from Nathan
