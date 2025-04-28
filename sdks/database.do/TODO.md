# Database.do SDK Test Suite TODOs

This file documents tests that are currently skipped or failing in the test suite.

## Skipped Tests

1. Tests that require a local Payload CMS instance are skipped in CI environments. These tests are marked with `describeIfNotCI` and will only run locally.

## Known Issues

1. Network error tests may fail if the network or DNS resolves non-existent domains in unexpected ways.
2. Search functionality tests may need adjustments based on the actual implementation of search in the Payload CMS instance.

## Future Improvements

1. Add more comprehensive tests for complex querying scenarios
2. Add tests for schema validation
3. Add performance/load testing
4. Add tests for concurrent operations
