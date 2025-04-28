# Database.do SDK Test Suite TODOs

This file documents tests that are currently skipped or failing in the test suite.

## Runtime Checks

1. Tests that require a local Payload CMS instance check for availability at runtime. If Payload CMS is not running at localhost:3000, the tests will display a warning message and skip the test logic.
2. To run these tests successfully, start Payload CMS with `pnpm dev` before running the tests.

## Known Issues

1. Network error tests may fail if the network or DNS resolves non-existent domains in unexpected ways.
2. Search functionality tests may need adjustments based on the actual implementation of search in the Payload CMS instance.

## Future Improvements

1. Add more comprehensive tests for complex querying scenarios
2. Add tests for schema validation
3. Add performance/load testing
4. Add tests for concurrent operations
