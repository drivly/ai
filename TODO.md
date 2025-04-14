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

## Technical Challenges
- [x] Routing conflict between admin page and existing API routes
  - Solution: Moved admin page to `/app/(admin)/project-admin/[domain]`
  - Solution: Moved API route to `/app/(apis)/projects/[domain]`
- [ ] Verifying that the dynamic PayloadCMS instance works correctly with project-specific database
- [ ] Ensuring proper authentication and authorization for project-specific admin interfaces

## Verification Requirements
- [ ] Verify that the project-specific admin interface loads correctly
- [ ] Verify that collections are correctly generated from project nouns
- [ ] Verify that the database connection is correctly modified to use the project ID
- [ ] Verify that collections are ordered and grouped according to noun configuration
- [ ] Verify that the default schema is applied when no schema is defined

## Deployment Status
- [ ] PR created: https://github.com/drivly/ai/pull/1313
- [ ] CI passing
- [ ] Vercel deployment successful
