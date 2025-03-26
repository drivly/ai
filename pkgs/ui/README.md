# @drivly/ui

A comprehensive UI library for Drivly applications featuring modern components, hooks, and utilities built with Tailwind CSS v4 and shadcn/ui.

## Installation

```bash
pnpm add @drivly/ui
```

## Usage

### Styles

Import the global styles in your app:

```typescript
import '@drivly/ui/globals.css'
```

For just the base styles:

```typescript
import '@drivly/ui/base.css'
```

### Components

```typescript
import { Button, Card, Avatar } from '@drivly/ui/components'
```

### Utilities

```typescript
import { cn, formatFileSize, getGravatarUrl } from '@drivly/ui/lib'
```

### Hooks

```typescript
import { useOutsideClick, useCheckMobile, createRequiredContext } from '@drivly/ui/hooks'
```

## Features

- **Modern UI Components**: Based on shadcn/ui with customized styling
- **Tailwind CSS v4**: Utilizes the latest Tailwind CSS features
- **Responsive Design**: Components work across all screen sizes
- **Utility Functions**: Helpful formatting and styling utilities
- **Custom React Hooks**: Simplify common UI interactions
- **Type Safety**: Full TypeScript support

## Contents

### Styles

- `globals.css`: Main global styles with Tailwind directives
- `base.css`: Base styles and foundation

### Components

- UI Components: Buttons, Cards, Dialogs, Avatars, etc.
- Marketing Components: Hero sections, features, pricing tables

### Hooks

- `useOutsideClick`: Detect clicks outside a component
- `useCheckMobile`: Detect mobile devices
- `createRequiredContext`: Create React context with required values

### Utilities

- `cn`: Tailwind class merging utility
- `formatFileSize`: Format byte sizes to human-readable format
- `getGravatarUrl`: Generate Gravatar URLs from email addresses

## Development

This package is part of the Drivly monorepo. To build:

```bash
pnpm build
```

## License

Private - All rights reserved
