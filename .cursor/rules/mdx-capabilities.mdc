# MDX-Based Agent Capabilities

This rule defines the capabilities and requirements for MDX-based agent definitions.

## Applies to
**/content/**/*.mdx

## Rule
### MDX-Based Agent Capabilities
- MDX-based agent definitions support:
  - Structured data through frontmatter including tools, inputs, and outputs
  - Full code execution capabilities with import/export support
  - Visual component integration rendered as JSX/React components
  - Agent state visualization with support for multiple states/modes
- MDX content files should be located at `/content/**/*.mdx`
- The Velite content build step (`build:content`) must be integrated into the Vercel build process
- Content files should use plural names for core primitives (Functions, Agents, Workflows) to match domain names

### Documentation Practices
- Documentation files and references should use plural names for core primitives (Functions, Agents, Workflows) to match domain names
- The README.md in the root directory contains the strategic vision and should be used as the source of truth
- MDX files in the content folder should be aligned with this vision
- Use consistent terminology: Functions, Workflows, Integrations/Actions (not "tools")
- Composio provides the underlying infrastructure but this should not be exposed in user-facing documentation
