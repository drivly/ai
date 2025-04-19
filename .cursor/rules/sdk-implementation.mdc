# SDK Implementation Patterns

This rule defines the implementation patterns for SDK packages in the AI Primitives platform.

## Applies to
**/sdks/**/*.{ts,tsx,js,jsx}

## Rule
### SDK Implementation Requirements
- SDK implementations in `/sdks/` must maintain zero dependencies (except apis.do) to be publishable on npm
- Backend implementations of SDK features should be placed in the `/tasks/` folder
- When moving code from SDK to tasks, ensure all SDK files are completely reverted to maintain zero dependencies
- Task implementations can use workspace-level dependencies (installed with -w flag)
- Package entry points in package.json files should point to built files (e.g., dist/index.js) rather than source files
- Use modern Node.js features (Node 20+ or 22+):
  - Use built-in fetch instead of node-fetch or require('https')
  - Avoid older Node.js built-in modules when modern alternatives exist

### Versioning Strategy
- Use semantic-release for version management across SDKs and packages
- Packages in the `sdks` directory must maintain synchronized version numbers
- Packages in the `pkgs` directory can be versioned independently
- During API instability phase, restrict all automatic version increments to patch versions (0.0.x) only
- All packages must be properly configured in pnpm-workspace.yaml
- Package names must exactly match names in respective package.json files

### Agents.do Implementation Style
```typescript
export const agentName = new Agent({
  name: "agent-name",
  instructions: "Brief, clear instructions about the agent's role and purpose",
  model: openai("model-name"),
})
```
