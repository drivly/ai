# motion.md

[![npm version](https://img.shields.io/npm/v/motion.md.svg)](https://www.npmjs.com/package/motion.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Convert Markdown to video presentations using Remotion.

## Overview

motion.md is a library that takes specially-formatted Markdown with YAML frontmatter and generates professional-looking video presentations using Remotion. The library parses global video configuration and per-slide settings from the Markdown and renders a video presentation.

## Installation

```bash
npm install motion.md
# or
yarn add motion.md
# or
pnpm add motion.md
```

## Usage

### Basic Example

Create a markdown file with frontmatter configuration:

```markdown
---
title: My Video Presentation
output: video.mp4
fps: 30
resolution:
  width: 1920
  height: 1080
transition: fade
---

layout: intro
voiceover: Discover motion.md - the future of dynamic video generation

---

# Welcome to motion.md

This is a powerful tool for creating videos from Markdown.

---

voiceover: Markdown-based workflow explained.
layout: cover

---

## Features

- Markdown-based workflow
- Slidev syntax compatibility
- Video output with Remotion

---

background: stock:mountains.jpg
voiceover: Here are some amazing features.
transition: slide

---

## Advanced Configuration

This slide uses nested frontmatter for configuration.
```

### Generate a video

Using the CLI:

```bash
npx motion.md render presentation.md --output video.mp4
```

Using the API:

```typescript
import { parseMarkdownWithFrontmatter, createVideoFromSlides } from 'motion.md'

// Parse the markdown
const { globalConfig, slides } = parseMarkdownWithFrontmatter(markdownContent)

// Generate the video
const result = await createVideoFromSlides({
  slides,
  config: globalConfig,
  outputPath: 'output.mp4',
  options: {
    tts: true,
    quality: 'production',
  },
})

console.log(`Video generated at ${result.outputPath}`)
```

## Features

- **Markdown-based workflow**: Create videos using familiar Markdown syntax
- **Nested frontmatter**: Configure global settings and per-slide options
- **Multiple layouts**: Support for intro, cover, and default slide layouts
- **Media components**: Embed images, videos, and browser screenshots
- **Voiceover support**: Add narration to your slides
- **Transition effects**: Apply transitions between slides
- **Background customization**: Use colors or images as slide backgrounds

## API Reference

### `parseMarkdownWithFrontmatter(markdown: string)`

Parses Markdown content with frontmatter into slides and configuration.

### `createVideoFromSlides(options: VideoGenerationOptions)`

Generates a video from parsed slides using Remotion.

## CLI Commands

```bash
# Render a markdown file to video
motion.md render <input> [options]

# Options:
#   -o, --output <path>       Output file path
#   -q, --quality <quality>   Video quality (draft or production)
#   --no-tts                  Disable text-to-speech
```

## Dependencies

- [Remotion](https://www.remotion.dev/) - Video rendering engine
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [unified](https://unifiedjs.com/) - Markdown processing
