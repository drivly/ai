---
"functions.do": patch
---

feat(functions.do): Implement async iterator support for AI interface

Adds streaming support to the `ai` interface via async iterators. This allows users to process LLM responses chunk by chunk.

- Extends `AI_Instance` and adds `StreamingAIConfig` in `sdks/functions.do/types.ts`.
- Implements streaming logic in the proxy handler in `pkgs/ai-functions/src/ai.ts`.
- Updates `sdks/functions.do/index.ts` to handle streaming requests and responses.
- Adds streaming support to tagged template literals.
- Updates `lib/ai.ts` for consistency.
- Adds tests for streaming functionality in `pkgs/ai-functions/test/ai.test.ts` and `sdks/functions.do/index.test.ts`.

Addresses ENG-380.
