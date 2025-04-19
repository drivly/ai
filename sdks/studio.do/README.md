# studio.do

SDK for creating custom-branded Payload CMS instances with collections derived from Project data.

## Features

- Create white-labeled Payload CMS instances
- Populate instances with collections derived from Nouns in a Project
- Include tasks derived from Functions in a Project
- Include workflows derived from Workflows in a Project
- Customizable theming options
- Integration with `payload-agent` for chat widget

## Installation

```bash
npm install studio.do
# or
yarn add studio.do
# or
pnpm add studio.do
```

## Usage

```typescript
import { createStudioClient } from 'studio.do'

// Create a studio client for a project
const studio = await createStudioClient({
  projectId: 'your-project-id',
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#ff0080',
    },
    fonts: {
      body: 'Inter, sans-serif',
      heading: 'Inter, sans-serif',
    },
    logo: '/logo.svg',
    favicon: '/favicon.ico',
  },
  agentOptions: {
    type: 'modal',
    logo: '/logo.svg',
    aiAvatar: '/ai-avatar.png',
    defaultMessage: 'Hello! How can I help you today?',
    withOverlay: true,
    withOutsideClick: true,
  },
})

// Access collections derived from project nouns
const users = await studio.users.find({
  limit: 10,
})

// Access tasks derived from project functions
const tasks = await studio.tasks.find({
  where: {
    status: { equals: 'completed' },
  },
})

// Access workflows derived from project workflows
const workflows = await studio.workflows.find({
  where: {
    status: { equals: 'active' },
  },
})
```

## API Reference

### `createStudioClient(options)`

Creates a Payload client for a project with collections derived from Project data.

#### Options

| Property       | Type                  | Description                                            |
| -------------- | --------------------- | ------------------------------------------------------ |
| `projectId`    | `string`              | **Required**. ID of the project to create a studio for |
| `theme`        | `ThemeOptions`        | Optional theme configuration for white-labeling        |
| `agentOptions` | `PayloadAgentOptions` | Optional configuration for the chat widget             |

#### Returns

Returns a configured Payload client with collections derived from Project data.

### ThemeOptions

| Property            | Type     | Description           |
| ------------------- | -------- | --------------------- |
| `colors.primary`    | `string` | Primary theme color   |
| `colors.secondary`  | `string` | Secondary theme color |
| `colors.background` | `string` | Background color      |
| `colors.text`       | `string` | Text color            |
| `fonts.body`        | `string` | Body font family      |
| `fonts.heading`     | `string` | Heading font family   |
| `logo`              | `string` | Logo image URL        |
| `favicon`           | `string` | Favicon URL           |

### PayloadAgentOptions

| Property           | Type                                                      | Description                      |
| ------------------ | --------------------------------------------------------- | -------------------------------- |
| `type`             | `'modal' \| 'panel' \| 'resizable'`                       | Chat interface type              |
| `logo`             | `string`                                                  | Logo image URL                   |
| `aiAvatar`         | `string`                                                  | Avatar image URL for AI messages |
| `defaultMessage`   | `string`                                                  | Initial message to display       |
| `withOverlay`      | `boolean`                                                 | Show background overlay          |
| `withOutsideClick` | `boolean`                                                 | Close on outside click           |
| `suggestions`      | `Array<{ title: string, label: string, action: string }>` | Suggested prompts                |
