# mdxdb TODO

## Implementation Progress

- [x] Extend MDXDBOptions interface to include backend selection
- [x] Create PayloadHandler class for Payload CMS operations
- [x] Create PayloadCollectionHandler class for collection operations
- [x] Create collection factory for backend selection
- [x] Update DB function to support both backends
- [x] Define the four required collections (Types, Resources, Relationships, Users)
- [x] Add helper function to initialize Payload DB
- [x] Update package.json to add Payload as optional peer dependency
- [x] Create tests for Payload backend
- [x] Update README.md with documentation

## Future Improvements

- [ ] Fix getPayload initialization options in initializePayloadDB function
- [ ] Add support for authentication with the Users collection
- [ ] Improve search functionality for Payload backend
- [ ] Add support for more complex queries
- [ ] Add support for pagination in the Payload backend
- [ ] Add support for sorting in the Payload backend
- [ ] Add support for filtering in the Payload backend
- [ ] Add migration utilities to move data between backends
- [ ] Add TypeScript type definitions for collection schemas
- [ ] Implement hooks for collection operations
