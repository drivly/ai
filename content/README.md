# Drivly AI Platform Documentation

This directory contains the documentation for the entire Drivly AI Platform. The content is organized into sections that cover different aspects of the platform, including AI services, integrations, and development resources.

## Documentation Structure

- **AI**: Core AI capabilities including models, providers, and integration patterns
- **Agents**: Autonomous AI agents for various tasks and workflows
- **API**: API documentation and integration guides
- **Code**: Code examples, libraries, and development resources
- **Data**: Data models, schemas, and data management tools
- **Evals**: Evaluation frameworks and benchmarks for AI systems
- **Events**: Event handling and processing documentation
- **Experiments**: Experimental features and capabilities
- **Functions**: Serverless function documentation and examples
- **Observability**: Monitoring, logging, and observability tools
- **Websites**: Website integration and frontend development
- **Workers**: Workers and background processing documentation
- **Workflows**: AI workflow design and automation

## Adding Documentation

To add new documentation:

1. Create a new `.mdx` file in the appropriate directory
2. Add frontmatter with appropriate metadata
3. Write your documentation using Markdown and MDX components
4. Update the `_meta.ts` file if needed to include your page in navigation

## Example Page Structure

```mdx
---
title: Example Page
description: This is an example page showing how to format documentation
---

# Example Page

Content goes here...

## Subsection

More content...
```

## Components

You can use the following components in your MDX files:

- **CodeBlock**: For syntax-highlighted code examples
- **Callout**: For important notes and warnings
- **APIEndpoint**: For documenting API endpoints
- **Steps**: For step-by-step instructions

## Editing Content

Content is processed by Velite and integrated with Nextra for documentation display. The content is written in MDX format, which allows for embedding React components alongside Markdown syntax.

Changes to content files are automatically processed during development and build processes.

## Content Organization

- Each major section has its own directory
- The `_meta.ts` file controls navigation structure
- Index files (`index.mdx`) provide overview for each section
- Use nested directories for more complex documentation hierarchies
