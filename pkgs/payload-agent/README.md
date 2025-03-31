# @drivly/payload-agent

A powerful AI chat agent for Payload CMS built with the Vercel AI SDK. This package provides both a customizable chat interface and a flexible API for implementing AI assistants in your Payload CMS admin panel or frontend.

## Features

- **Payload CMS Plugin**: Easy integration with Payload CMS admin panel
- **Flexible Chat UI**: Modal, panel, or resizable layouts
- **AI Chat API**: Built on Vercel AI SDK with OpenAI integration
- **Authentication Support**: Optional user authentication with Payload
- **Customizable Styling**: Extensive style customization options
- **Tool Integration**: Support for custom AI tools and functions
- **Streaming Responses**: Real-time streaming of AI responses

## Installation

```bash
pnpm add @drivly/payload-agent
```

## Plugin Setup

Add the plugin to your Payload configuration:

```typescript
// payload.config.ts
import { payloadAgentPlugin } from '@drivly/payload-agent'

export default buildConfig({
  // ... your payload config
  plugins: [
    payloadAgentPlugin({
      type: 'modal',
      logo: '/logo.svg',
      aiAvatar: '/ai-avatar.png',
      defaultMessage: 'Hello! How can I help you today?',
      withOverlay: true,
      withOutsideClick: true,
      // Optional - provide authentication function
      getAuthResult: async () => {
        // Return authenticated user from Payload
        return { user: /* user object */ }
      }
    }),
  ],
})
```

## Chat Component Usage

### Modal Chat

Appears as a floating modal dialog:

```tsx
import { ChatBot } from '@drivly/payload-agent/chat-bot'

export default function Page() {
  return <ChatBot type='modal' logo='/logo.svg' aiAvatar='/ai-avatar.png' defaultMessage='Hello! How can I help you today?' withOverlay withOutsideClick />
}
```

### Panel Chat

Slides in from the side of the screen:

```tsx
import { ChatBot } from '@drivly/payload-agent/chat-bot'

export default function Page() {
  return <ChatBot type='panel' logo='/logo.svg' withOverlay withOutsideClick />
}
```

### Resizable Chat

Resizable layout that wraps your content:

```tsx
import { ChatBot } from '@drivly/payload-agent/chat-bot'

export default function Layout({ children }) {
  return (
    <ChatBot type='resizable' direction='horizontal' logo='/logo.svg'>
      {children}
    </ChatBot>
  )
}
```

## Authentication

The chat component and API can be configured to require authentication:

```tsx
import { ChatBot } from '@drivly/payload-agent/chat-bot'
import { getCachedAuthResult } from './auth'

export default function Page() {
  return (
    <ChatBot
      type='modal'
      logo='/logo.svg'
      getAuthResult={getCachedAuthResult}
      requireAuth={true} // Only allow authenticated users
    />
  )
}
```

## API Usage

Create a custom AI chat endpoint:

```typescript
// app/api/chat/route.ts
import { createChatRoute } from '@drivly/payload-agent/api'
import { getCachedAuthResult } from '../../../lib/auth'

// Create a chat route with custom configuration
export const POST = createChatRoute({
  model: 'gpt-4o',
  modelOptions: {
    temperature: 0.7,
    maxTokens: 2000,
  },
  systemPrompt: 'You are a helpful assistant for Drivly.',
  getAuthResult: getCachedAuthResult,
  requireAuth: true,
  tools: {
    // Add custom tools here
  },
})

export const GET = createChatRoute()
```

## Styling Customization

The chat interface can be styled with custom CSS classes:

```tsx
<ChatBot
  type='modal'
  logo='/logo.svg'
  chatOptions={{
    rootStyle: 'custom-root-class',
    triggerStyle: 'custom-trigger-class',
    containerStyle: 'custom-container-class',
    headerStyle: 'custom-header-class',
    headerButtonStyle: 'custom-header-button-class',
    headerLogoStyle: 'custom-header-logo-class',
    headerTitleStyle: 'custom-header-title-class',
  }}
/>
```

## Suggested Prompts

Add suggested prompts to help users get started:

```tsx
<ChatBot
  type='modal'
  logo='/logo.svg'
  suggestions={[
    {
      title: 'Getting Started',
      label: 'How do I get started?',
      action: 'How do I get started with Drivly?',
    },
    {
      title: 'Features',
      label: 'What features do you offer?',
      action: 'What features does Drivly offer?',
    },
  ]}
/>
```

## API Reference

### Plugin Options

| Property           | Type                                | Description                      |
| ------------------ | ----------------------------------- | -------------------------------- |
| `type`             | `'modal' \| 'panel' \| 'resizable'` | Chat interface type              |
| `logo` or `title`  | `string`                            | Display logo image or title text |
| `aiAvatar`         | `string \| null`                    | Avatar image URL for AI messages |
| `defaultMessage`   | `string`                            | Initial message to display       |
| `direction`        | `'horizontal' \| 'vertical'`        | Direction for resizable layout   |
| `withOverlay`      | `boolean`                           | Show background overlay          |
| `withOutsideClick` | `boolean`                           | Close on outside click           |
| `suggestions`      | `Suggestion[]`                      | Suggested prompts                |
| `getAuthResult`    | `() => Promise<AuthResult>`         | Auth function                    |
| `requireAuth`      | `boolean`                           | Require authentication           |
| `chatOptions`      | `ChatClassNameProps`                | Custom CSS classes               |

### Chat API Options

| Property            | Type                        | Description            |
| ------------------- | --------------------------- | ---------------------- |
| `model`             | `string`                    | OpenAI model ID        |
| `modelOptions`      | `object`                    | Model parameters       |
| `tools`             | `Record<string, Tool>`      | AI tools               |
| `systemPrompt`      | `string \| PromptTemplate`  | System prompt          |
| `promptContext`     | `Record<string, unknown>`   | Additional context     |
| `toolCallStreaming` | `boolean`                   | Stream tool calls      |
| `getAuthResult`     | `() => Promise<AuthResult>` | Auth function          |
| `requireAuth`       | `boolean`                   | Require authentication |

## License

Private - All rights reserved
