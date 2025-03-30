# apis.do Types Generation

When working with the apis.do SDK, always run the type generation script to ensure types are properly synchronized with the Payload CMS collection types:

1. Run `pnpm generate:types` to generate Payload types
2. This automatically runs `pnpm sync:sdk-types` which syncs types to the SDK

The script is located at `scripts/sync-sdk-types.ts` and maintains compatibility between the Payload CMS collection types and the apis.do SDK.

**Important:** Never manually modify the types.ts file in the apis.do SDK. If you need to add additional types or interfaces, add them to the utility types section in the script.

## How it works

The script:
1. Reads the existing types.ts file
2. Replaces the collection type definitions with predefined types from the script
3. Preserves utility types (like ErrorResponse, ListResponse, etc.)

If you need to add new utility types, add them to the types.ts file and they will be preserved by the script.
