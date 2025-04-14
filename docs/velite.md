# https://velite.js.org llms-full.txt

## Velite: Creative Content Solutions
[Skip to content](https://velite.js.org/#VPContent)

# VeliteMake Creative Contents Easy

New Choices for Content-first Apps

[Get Started](https://velite.js.org/guide/quick-start)

[View on GitHub](https://github.com/zce/velite)

![Velite Logo](https://velite.js.org/assets/icon.svg)

🤩

## Out of the Box

Turns your Markdown / MDX, YAML, JSON, or other files into application data layer.

💪

## Type-Safe Contents

Content Fields validation based on Zod schema, and auto-generated TypeScript types.

🚀

## Light & Efficient

Light-weight & High efficiency & Still powerful, faster startup, and better performance.

🗂️

## Assets Processing

Built-in Assets Processing, such as relative path resolving, image optimization, etc.

## Velite Configuration Guide
[Skip to content](https://velite.js.org/reference/config#VPContent)

On this page

# Configuration [​](https://velite.js.org/reference/config\#configuration)

When running `velite` from the command line, Velite will automatically try to resolve a config file named `velite.config.js` inside project root (other JS and TS extensions are also supported).

## Velite Config File [​](https://velite.js.org/reference/config\#velite-config-file)

Velite uses `velite.config.js` as the config file. You can create it in the root directory of your project.

js

```
// velite.config.js
export default {
  // ...
}
```

TIP

Config file supports TypeScript & ESM & CommonJS. you can use the full power of TypeScript to write your config file, and it's recommended strongly.

## Typed Config [​](https://velite.js.org/reference/config\#typed-config)

For better typing, Velite provides a `defineConfig` identity function to define the config file type.

js

```
import { defineConfig } from 'velite'

export default defineConfig({
  // ...
})
```

In addition, Velite also provides a `UserConfig` type to describe the config file type.

js

```
/** @type {import('velite').UserConfig} */
export default {
  // ...
}
```

ts

```
import type { UserConfig } from 'velite'

const config: UserConfig = {
  // ...
}

export default config
```

TIP

Recommended to use `defineConfig` identity function to define the config file type, because it can provide better type inference.

And other identity functions to help you define the config file type:

- `defineCollection`: define collection options
- `defineLoader`: define a file loader

## `root` [​](https://velite.js.org/reference/config\#root)

- Type: `string`
- Default: `'content'`

The root directory of the contents, relative to resolved config file.

#### `strict` [​](https://velite.js.org/reference/config\#strict)

- Type: `boolean`
- Default: `false`

If true, throws an error and terminates the process if any schema validation fails. Otherwise, a warning is logged but the process does not terminate.

## `output` [​](https://velite.js.org/reference/config\#output)

- Type: `object`

The output configuration.

### `output.data` [​](https://velite.js.org/reference/config\#output-data)

- Type: `string`
- Default: `'.velite'`

The output directory of the data files, relative to resolved config file.

### `output.assets` [​](https://velite.js.org/reference/config\#output-assets)

- Type: `string`
- Default: `'public/static'`

The directory of the assets, relative to resolved config file. This directory should be served statically by the app.

### `output.base` [​](https://velite.js.org/reference/config\#output-base)

- Type: ``'/' | `/${string}/` | `.${string}/` | `${string}:${string}/` ``
- Default: `'/static/'`

The public base path of the assets. This option is used to generate the asset URLs. It should be the same as the `base` option of the app and end with a slash.

### `output.name` [​](https://velite.js.org/reference/config\#output-name)

- Type: `string`
- Default: `'[name]-[hash:8].[ext]'`

This option determines the name of each output asset. The asset will be written to the directory specified in the `output.assets` option. You can use `[name]`, `[hash]` and `[ext]` template strings with specify length.

### `output.clean` [​](https://velite.js.org/reference/config\#output-clean)

- Type: `boolean`
- Default: `false`

Whether to clean the output directories before build.

### `output.format` [​](https://velite.js.org/reference/config\#output-format)

- Type: `'esm' | 'cjs'`
- Default: `'esm'`

The output format of the entry file.

## `collections` [​](https://velite.js.org/reference/config\#collections)

- Type: `{ [name: string]: Collection }`

The collections definition.

### `collections[name].name` [​](https://velite.js.org/reference/config\#collections-name-name)

- Type: `string`

The name of the collection. This is used to generate the type name for the collection.

js

```
const posts = defineCollection({
  name: 'Post'
})
```

The type name is usually a singular noun, but it can be any valid TypeScript identifier.

### `collections[name].pattern` [​](https://velite.js.org/reference/config\#collections-name-pattern)

- Type: `string`

The glob pattern of the collection files, based on `root`.

js

```
const posts = defineCollection({
  pattern: 'posts/*.md'
})
```

### `collections[name].single` [​](https://velite.js.org/reference/config\#collections-name-single)

- Type: `boolean`
- Default: `false`

Whether the collection is single. If `true`, the collection will be treated as a single file, and the output data will be an object instead of an array.

js

```
const site = defineCollection({
  pattern: 'site/index.yml',
  single: true
})
```

### `collections[name].schema` [​](https://velite.js.org/reference/config\#collections-name-schema)

- Type: `Schema`, See [Schema](https://velite.js.org/guide/velite-schemas) for more information.

The schema of the collection.

js

```
const posts = defineCollection({
  schema: s.object({
    title: s.string(), // from frontmatter
    description: s.string().optional(), // from frontmatter
    excerpt: s.string(), // from markdown body,
    content: s.string() // from markdown body
  })
})
```

## `loaders` [​](https://velite.js.org/reference/config\#loaders)

- Type: `Loader[]`, See [Loader](https://velite.js.org/reference/types#loader)
- Default: `[]`, built-in loaders: `'json'`, `'yaml'`, `'matter'`

The file loaders. You can use it to load files that are not supported by Velite. For more information, see [Custom Loaders](https://velite.js.org/guide/custom-loader).

## `markdown` [​](https://velite.js.org/reference/config\#markdown)

- Type: `MarkdownOptions`, See [MarkdownOptions](https://velite.js.org/reference/types#markdownoptions)

Global Markdown options.

### `markdown.gfm` [​](https://velite.js.org/reference/config\#markdown-gfm)

- Type: `boolean`
- Default: `true`

Enable GitHub Flavored Markdown (GFM).

### `markdown.removeComments` [​](https://velite.js.org/reference/config\#markdown-removecomments)

- Type: `boolean`
- Default: `true`

Remove html comments.

### `markdown.copyLinkedFiles` [​](https://velite.js.org/reference/config\#markdown-copylinkedfiles)

- Type: `boolean`
- Default: `true`

Copy linked files to public path and replace their urls with public urls.

### `markdown.remarkPlugins` [​](https://velite.js.org/reference/config\#markdown-remarkplugins)

- Type: `PluggableList`, See [PluggableList](https://unifiedjs.com/explore/package/unified/#pluggablelist)
- Default: `[]`

Remark plugins.

### `markdown.rehypePlugins` [​](https://velite.js.org/reference/config\#markdown-rehypeplugins)

- Type: `PluggableList`, See [PluggableList](https://unifiedjs.com/explore/package/unified/#pluggablelist)
- Default: `[]`

Rehype plugins.

## `mdx` [​](https://velite.js.org/reference/config\#mdx)

- Type: `MdxOptions`, See [MdxOptions](https://velite.js.org/reference/types#mdxoptions)

Global MDX options.

### `mdx.gfm` [​](https://velite.js.org/reference/config\#mdx-gfm)

- Type: `boolean`
- Default: `true`

Enable GitHub Flavored Markdown (GFM).

### `mdx.removeComments` [​](https://velite.js.org/reference/config\#mdx-removecomments)

- Type: `boolean`
- Default: `true`

Remove html comments.

### `mdx.copyLinkedFiles` [​](https://velite.js.org/reference/config\#mdx-copylinkedfiles)

- Type: `boolean`
- Default: `true`

Copy linked files to public path and replace their urls with public urls.

More options, see [MDX Compile Options](https://mdxjs.com/packages/mdx/#compileoptions).

## `prepare` [​](https://velite.js.org/reference/config\#prepare)

- Type: `(data: Result<Collections>, context: Context) => Promisable<void | false>`

Data prepare hook, executed before write to file. You can apply additional processing to the output data, such as modify them, add missing data, handle relationships, or write them to files. return false to prevent the default output to a file if you wanted.

js

```
export default defineConfig({
  collections: { posts, tags },
  prepare: (data, context) => {
    // modify data
    data.posts.push({ ... })
    data.tags.push({ ... })

    // context
    const { config } = context
    // config is resolved from `velite.config.js` with default values

    // return false to prevent the default output to a file
  }
})
```

## `complete` [​](https://velite.js.org/reference/config\#complete)

- Type: `(data: Result<Collections>, context: Context) => Promisable<void>`

Build success hook, executed after the build is complete. You can do anything after the build is complete, such as print some tips or deploy the output files.

## Velite and Next.js
[Skip to content](https://velite.js.org/examples/nextjs#VPContent)

On this page

# With Next.js [​](https://velite.js.org/examples/nextjs\#with-next-js)

Velite loves [Next.js](https://nextjs.org/), it's a great framework for building full-stack web applications.

Some examples that may help you:

- [zce/taxonomy](https://github.com/zce/taxonomy) \- A fork of [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy) using Velite.

This example shows how to use Velite with Next.js.

## Try it online [​](https://velite.js.org/examples/nextjs\#try-it-online)

Velite Next.js - StackBlitz

Project

Search

Ports in use

Settings

readme.md

More Actions…

1

2

3

# Next.js + MDX + Velite

A template with Next.js 15

Enter to Rename, Shift+Enter to Preview

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

Terminal\_1

#### Terminal\_1

[Astro Basics\\
\\
Node.js](https://stackblitz.com/fork/github/withastro/astro/tree/latest/examples/basics?file=README.md&title=Astro%20Starter%20Kit:%20Basics) [Next.js\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/nextjs?title=Next.js%20Starter&description=The%20React%20framework%20for%20production) [Nuxt\\
\\
Node.js](https://stackblitz.com/fork/github/nuxt/starter/tree/v3-stackblitz) [React\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-react-ts?file=index.html&terminal=dev) [Vanilla\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla?file=index.html&terminal=dev) [Vanilla\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla-ts?file=index.html&terminal=dev) [Static\\
\\
HTML/JS/CSS](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/static?title=Static%20Starter&description=HTML/CSS/JS%20Starter&file=script.js,styles.css,index.html&terminalHeight=10) [Node.js\\
\\
Blank project](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/node?title=node.new%20Starter&description=Starter%20project%20for%20Node.js%2C%20a%20JavaScript%20runtime%20built%20on%20Chrome%27s%20V8%20JavaScript%20engine) [Angular\\
\\
TypeScript](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/angular?template=node&title=Angular%20Starter&description=An%20angular-cli%20project%20based%20on%20%40angular%2Fanimations%2C%20%40angular%2Fcommon%2C%20%40angular%2Fcompiler%2C%20%40angular%2Fcore%2C%20%40angular%2Fforms%2C%20%40angular%2Fplatform-browser%2C%20%40angular%2Fplatform-browser-dynamic%2C%20%40angular%2Frouter%2C%20core-js%2C%20rxjs%2C%20tslib%20and%20zone.js) [Vue\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vue?file=index.html&terminal=dev) [WebContainer API\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/webcontainer-api-starter)

# Publish a package

Are you trying to publish ``?

CancelConfirm

# Allow access to localhost resource

Request to:

More information

```
Method: undefined
Headers:
```

Warning

Allowing access to your localhost resources can lead to security issues such as unwanted request access or data leaks through your localhost.

Do not ask me again

BlockAllow

# Out of memory error

This browser tab is running out of memory. Free up memory by closing other StackBlitz tabs and then refresh the page.

OK [Learn more](https://developer.stackblitz.com/codeflow/working-in-codeflow-ide#out-of-memory-error)

## Source code [​](https://velite.js.org/examples/nextjs\#source-code)

👉 [https://stackblitz.com/github/zce/velite/tree/main/examples/nextjs](https://stackblitz.com/github/zce/velite/tree/main/examples/nextjs)

See [examples](https://github.com/zce/velite/tree/main/examples) for more examples.

## Project structure [​](https://velite.js.org/examples/nextjs\#project-structure)

text

```
nextjs
├── app                      # Next.js app directory
│   ├── layout.tsx
│   ├── page.tsx
│   └── etc...
├── components
│   ├── mdx-content.tsx
│   └── etc...
├── content                  # content directory
│   ├── categories
│   │   ├── journal.jpg
│   │   ├── journal.yml
│   │   └── etc...
│   ├── options
│   │   └── index.yml
│   ├── pages
│   │   ├── about
│   │   │   └── index.mdx
│   │   └── contact
|   |       ├── img.png and more...
│   │       └── index.mdx
│   ├── posts
│   │   ├── 1970-01-01-style-guide
│   │   │   ├── cover.jpg and more...
│   │   │   └── index.md
│   │   └── 1992-02-25-hello-world
│   │       ├── cover.jpg and more...
│   │       └── index.md
│   └── tags
│       └── index.yml
├── public                   # public directory
│   ├── favicon.ico
│   └── etc...
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── velite.config.ts         # Velite config file
```

## Usage [​](https://velite.js.org/examples/nextjs\#usage)

shell

```
$ npm install # install dependencies
$ npm run dev # run build in watch mode
$ npm run build # build content by velite
```

Refer to [Integration with Next.js](https://velite.js.org/guide/with-nextjs) for more details about Velite with Next.js.

## Velite Types Reference
[Skip to content](https://velite.js.org/reference/types#VPContent)

On this page

# Types [​](https://velite.js.org/reference/types\#types)

## Image [​](https://velite.js.org/reference/types\#image)

ts

```
/**
 * Image object with metadata & blur image
 */
interface Image {
  /**
   * public url of the image
   */
  src: string
  /**
   * image width
   */
  width: number
  /**
   * image height
   */
  height: number
  /**
   * blurDataURL of the image
   */
  blurDataURL: string
  /**
   * blur image width
   */
  blurWidth: number
  /**
   * blur image height
   */
  blurHeight: number
}
```

## Loader [​](https://velite.js.org/reference/types\#loader)

ts

```
/**
 * File loader
 */
interface Loader {
  /**
   * Loader name
   * @description
   * The same name will overwrite the built-in loader,
   * built-in loaders: 'json', 'yaml', 'matter'
   */
  name: string
  /**
   * File test regexp
   * @example
   * /\.md$/
   */
  test: RegExp
  /**
   * Load file content
   * @param file vfile
   * @returns entry or entries
   */
  load: (file: VFile) => Promisable<Entry | Entry[]>
}
```

## VeliteFile [​](https://velite.js.org/reference/types\#velitefile)

ts

```
interface ZodMeta extends VeliteFile {}

class VeliteFile extends VFile {
  /**
   * Get parsed records from file
   */
  get records(): unknown

  /**
   * Get content of file
   */
  get content(): string | undefined

  /**
   * Get mdast object from cache
   */
  get mdast(): Root | undefined

  /**
   * Get hast object from cache
   */
  get hast(): Nodes | undefined

  /**
   * Get plain text of content from cache
   */
  get plain(): string | undefined

  /**
   * Get meta object from cache
   * @param path file path
   * @returns resolved meta object if exists
   */
  static get(path: string): VeliteFile | undefined

  /**
   * Create meta object from file path
   * @param options meta options
   * @returns resolved meta object
   */
  static async create({ path, config }: { path: string; config: Config }): Promise<VeliteFile>
}
```

## MarkdownOptions [​](https://velite.js.org/reference/types\#markdownoptions)

ts

```
/**
 * Markdown options
 */
interface MarkdownOptions {
  /**
   * Enable GitHub Flavored Markdown (GFM).
   * @default true
   */
  gfm?: boolean
  /**
   * Remove html comments.
   * @default true
   */
  removeComments?: boolean
  /**
   * Copy linked files to public path and replace their urls with public urls.
   * @default true
   */
  copyLinkedFiles?: boolean
  /**
   * Remark plugins.
   */
  remarkPlugins?: PluggableList
  /**
   * Rehype plugins.
   */
  rehypePlugins?: PluggableList
}
```

Refer to [Unified](https://unifiedjs.com/explore/package/unified/#pluggablelist) for more information about `remarkPlugins` and `rehypePlugins`.

## MdxOptions [​](https://velite.js.org/reference/types\#mdxoptions)

ts

```
/**
 * MDX compiler options
 */
export interface MdxOptions extends Omit<CompileOptions, 'outputFormat'> {
  /**
   * Enable GitHub Flavored Markdown (GFM).
   * @default true
   */
  gfm?: boolean
  /**
   * Remove html comments.
   * @default true
   */
  removeComments?: boolean
  /**
   * Copy linked files to public path and replace their urls with public urls.
   * @default true
   */
  copyLinkedFiles?: boolean
  /**
   * Output format to generate.
   * @default 'function-body'
   */
  outputFormat?: CompileOptions['outputFormat']
}
```

Refer to [MDX](https://mdxjs.com/packages/mdx/#compileoptions) for more information about `CompileOptions`.

## Velite Framework Example
[Skip to content](https://velite.js.org/examples/basic#VPContent)

On this page

# Framework Agnostic [​](https://velite.js.org/examples/basic\#framework-agnostic)

Velite is a framework agnostic library, it can be used in any JavaScript framework or library.

## Try it online [​](https://velite.js.org/examples/basic\#try-it-online)

Velite Basic - StackBlitz

Project

Search

Ports in use

Settings

readme.md

More Actions…

1

2

3

# @velite/example

> Framework Agnostic example

Enter to Rename, Shift+Enter to Preview

Terminal\_1

#### Terminal\_1

[Astro Basics\\
\\
Node.js](https://stackblitz.com/fork/github/withastro/astro/tree/latest/examples/basics?file=README.md&title=Astro%20Starter%20Kit:%20Basics) [Next.js\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/nextjs?title=Next.js%20Starter&description=The%20React%20framework%20for%20production) [Nuxt\\
\\
Node.js](https://stackblitz.com/fork/github/nuxt/starter/tree/v3-stackblitz) [React\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-react-ts?file=index.html&terminal=dev) [Vanilla\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla?file=index.html&terminal=dev) [Vanilla\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla-ts?file=index.html&terminal=dev) [Static\\
\\
HTML/JS/CSS](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/static?title=Static%20Starter&description=HTML/CSS/JS%20Starter&file=script.js,styles.css,index.html&terminalHeight=10) [Node.js\\
\\
Blank project](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/node?title=node.new%20Starter&description=Starter%20project%20for%20Node.js%2C%20a%20JavaScript%20runtime%20built%20on%20Chrome%27s%20V8%20JavaScript%20engine) [Angular\\
\\
TypeScript](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/angular?template=node&title=Angular%20Starter&description=An%20angular-cli%20project%20based%20on%20%40angular%2Fanimations%2C%20%40angular%2Fcommon%2C%20%40angular%2Fcompiler%2C%20%40angular%2Fcore%2C%20%40angular%2Fforms%2C%20%40angular%2Fplatform-browser%2C%20%40angular%2Fplatform-browser-dynamic%2C%20%40angular%2Frouter%2C%20core-js%2C%20rxjs%2C%20tslib%20and%20zone.js) [Vue\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vue?file=index.html&terminal=dev) [WebContainer API\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/webcontainer-api-starter)

# Publish a package

Are you trying to publish ``?

CancelConfirm

# Allow access to localhost resource

Request to:

More information

```
Method: undefined
Headers:
```

Warning

Allowing access to your localhost resources can lead to security issues such as unwanted request access or data leaks through your localhost.

Do not ask me again

BlockAllow

# Out of memory error

This browser tab is running out of memory. Free up memory by closing other StackBlitz tabs and then refresh the page.

OK [Learn more](https://developer.stackblitz.com/codeflow/working-in-codeflow-ide#out-of-memory-error)

## Source code [​](https://velite.js.org/examples/basic\#source-code)

👉 [https://stackblitz.com/github/zce/velite/tree/main/examples/nextjs](https://stackblitz.com/github/zce/velite/tree/main/examples/nextjs)

See [examples](https://github.com/zce/velite/tree/main/examples) for more examples.

## Project structure [​](https://velite.js.org/examples/basic\#project-structure)

text

```
basic
├── content                  # content directory
│   ├── categories
│   │   ├── journal.jpg
│   │   ├── journal.yml
│   │   └── etc...
│   ├── options
│   │   └── index.yml
│   ├── pages
│   │   ├── about
│   │   │   └── index.mdx
│   │   └── contact
|   |       ├── img.png and more...
│   │       └── index.mdx
│   ├── posts
│   │   ├── 1970-01-01-style-guide
│   │   │   ├── cover.jpg and more...
│   │   │   └── index.md
│   │   └── 1992-02-25-hello-world
│   │       ├── cover.jpg and more...
│   │       └── index.md
│   └── tags
│       └── index.yml
├── .gitignore
├── package.json
├── README.md
└── velite.config.js         # Velite config file
```

## Usage [​](https://velite.js.org/examples/basic\#usage)

shell

```
$ npm install # install dependencies
$ npm run dev # run build in watch mode
$ npm run build # build content by velite
```

Refer to [Quick Start](https://velite.js.org/guide/quick-start) for more details about Velite.

## Velite CLI Reference
[Skip to content](https://velite.js.org/reference/cli#VPContent)

On this page

# CLI Reference [​](https://velite.js.org/reference/cli\#cli-reference)

## Usage [​](https://velite.js.org/reference/cli\#usage)

npmpnpmyarnbun

sh

```
$ npx velite <command> [options]
```

sh

```
$ pnpm velite <command> [options]
```

sh

```
$ yarn velite <command> [options]
```

sh

```
$ bun velite <command> [options]
```

## Options [​](https://velite.js.org/reference/cli\#options)

| Option | Description |
| --- | --- |
| `-v, --version` | Print version number |
| `-h, --help` | Print help information |

## `velite build` [​](https://velite.js.org/reference/cli\#velite-build)

Build the contents with default config file in current directory.

### Usage [​](https://velite.js.org/reference/cli\#usage-1)

sh

```
$ velite build [options]
```

### Options [​](https://velite.js.org/reference/cli\#options-1)

| Option | Description | Default |
| --- | --- | --- |
| `-c, --config <path>` | Use specified config file | `velite.config.js` |
| `--clean` | Clean output directory before build | `false` |
| `--watch` | Watch for changes and rebuild | `false` |
| `--verbose` | Print additional information | `false` |
| `--silent` | Silent mode (no output) | `false` |
| `--strict` | Terminate process on schema validation error | `false` |
| `--debug` | Output full error stack trace | `false` |

## `velite dev` [​](https://velite.js.org/reference/cli\#velite-dev)

Build the contents with watch mode.

### Usage [​](https://velite.js.org/reference/cli\#usage-2)

sh

```
$ velite dev [options]
```

### Options [​](https://velite.js.org/reference/cli\#options-2)

| Option | Description | Default |
| --- | --- | --- |
| `-c, --config <path>` | Use specified config file | `velite.config.js` |
| `--clean` | Clean output directory before build | `false` |
| `--verbose` | Print additional information | `false` |
| `--silent` | Silent mode (no output) | `false` |
| `--strict` | Terminate process on schema validation error | `false` |
| `--debug` | Output full error stack trace | `false` |

## `velite init` [​](https://velite.js.org/reference/cli\#velite-init)

TODO: Create a default config file in current directory.

### Usage [​](https://velite.js.org/reference/cli\#usage-3)

sh

```
$ velite init [options]
```

## Velite Snippets
[Skip to content](https://velite.js.org/other/snippets#VPContent)

On this page

# Snippets [​](https://velite.js.org/other/snippets\#snippets)

## Last Modified Schema [​](https://velite.js.org/other/snippets\#last-modified-schema)

### Based on file stat [​](https://velite.js.org/other/snippets\#based-on-file-stat)

ts

```
import { stat } from 'fs/promises'
import { defineSchema } from 'velite'

const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>(i => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the file modified timestamp' })
      }

      const stats = await stat(meta.path)
      return stats.mtime.toISOString()
    })
)

// use it in your schema
const posts = defineCollection({
  // ...
  schema: {
    // ...
    lastModified: timestamp()
  }
})
```

### Based on git timestamp [​](https://velite.js.org/other/snippets\#based-on-git-timestamp)

ts

```
import { exec } from 'child_process'
import { promisify } from 'util'
import { defineSchema } from 'velite'

const execAsync = promisify(exec)

const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>(i => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`' })
      }
      const { stdout } = await execAsync(`git log -1 --format=%cd ${meta.path}`)
      return new Date(stdout || Date.now()).toISOString()
    })
)

// use it in your schema
const posts = defineCollection({
  // ...
  schema: {
    // ...
    lastModified: timestamp()
  }
})
```

## Remote Image with BlurDataURL Schema [​](https://velite.js.org/other/snippets\#remote-image-with-blurdataurl-schema)

ts

```
import { getImageMetadata, s } from 'velite'

import type { Image } from 'velite'

/**
 * Remote Image with metadata schema
 */
export const remoteImage = () =>
  s.string().transform<Image>(async (value, { addIssue }) => {
    try {
      const response = await fetch(value)
      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const metadata = await getImageMetadata(Buffer.from(buffer))
      if (metadata == null) throw new Error(`Failed to get image metadata: ${value}`)
      return { src: value, ...metadata }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      addIssue({ fatal: true, code: 'custom', message })
      return null as never
    }
  })
```

## Built-in `s.mdx()` schema result render [​](https://velite.js.org/other/snippets\#built-in-s-mdx-schema-result-render)

tsx

```
import * as runtime from 'react/jsx-runtime'

const sharedComponents = {
  // Add your global components here
}

// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

// MDXContent component
export const MDXContent = ({ code, components }: MDXProps) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
```

## MDX Bundle with ESBuild [​](https://velite.js.org/other/snippets\#mdx-bundle-with-esbuild)

tsx

```
import { join, resolve } from 'node:path'
import { globalExternals } from '@fal-works/esbuild-plugin-global-externals'
import mdxPlugin from '@mdx-js/esbuild'
import { build } from 'esbuild'

import type { Plugin } from 'esbuild'

const compileMdx = async (source: string): Promise<string> => {
  const virtualSourse: Plugin = {
    name: 'virtual-source',
    setup: build => {
      build.onResolve({ filter: /^__faker_entry/ }, args => {
        return {
          path: join(args.resolveDir, args.path),
          pluginData: { contents: source } // for mdxPlugin
        }
      })
    }
  }

  const bundled = await build({
    entryPoints: [`__faker_entry.mdx`],
    absWorkingDir: resolve('content'),
    write: false,
    bundle: true,
    target: 'node18',
    platform: 'neutral',
    format: 'esm',
    globalName: 'VELITE_MDX_COMPONENT',
    treeShaking: true,
    jsx: 'automatic',
    // minify: true,
    plugins: [\
      virtualSourse,\
      mdxPlugin({}),\
      globalExternals({\
        react: {\
          varName: 'React',\
          type: 'cjs'\
        },\
        'react-dom': {\
          varName: 'ReactDOM',\
          type: 'cjs'\
        },\
        'react/jsx-runtime': {\
          varName: '_jsx_runtime',\
          type: 'cjs'\
        }\
      })\
    ]
  })

  return bundled.outputFiles[0].text.replace('var VELITE_MDX_COMPONENT=', 'return ')
}
```

## Next.js Integration [​](https://velite.js.org/other/snippets\#next-js-integration)

CommonJSESM

js

```
/** @type {import('next').NextConfig} */
module.exports = {
  // othor next config here...
  webpack: config => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  }
}

class VeliteWebpackPlugin {
  static started = false
  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options
  }
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs !!!
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      this.options.watch = this.options.watch ?? dev
      this.options.clean = this.options.clean ?? !dev
      const { build } = await import('velite')
      await build(this.options) // start velite
    })
  }
}
```

js

```
import { build } from 'velite'

/** @type {import('next').NextConfig} */
export default {
  // othor next config here...
  webpack: config => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  }
}

class VeliteWebpackPlugin {
  static started = false
  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options
  }
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs !!!
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      this.options.watch = this.options.watch ?? dev
      this.options.clean = this.options.clean ?? !dev
      await build(this.options) // start velite
    })
  }
}
```

## HTML Excerpt [​](https://velite.js.org/other/snippets\#html-excerpt)

ts

```
import { excerpt as hastExcerpt } from 'hast-util-excerpt'
import { raw } from 'hast-util-raw'
import { toHtml } from 'hast-util-to-html'
import { truncate } from 'hast-util-truncate'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'

import { extractHastLinkedFiles } from '../assets'
import { custom } from './zod'

export interface ExcerptOptions {
  /**
   * Excerpt separator.
   * @default 'more'
   * @example
   * s.excerpt({ separator: 'preview' }) // split excerpt by `<!-- preview -->`
   */
  separator?: string
  /**
   * Excerpt length.
   * @default 300
   */
  length?: number
}

export const excerpt = ({ separator = 'more', length = 300 }: ExcerptOptions = {}) =>
  custom<string>().transform(async (value, { meta: { path, content, config } }) => {
    if (value == null && content != null) {
      value = content
    }
    try {
      const mdast = fromMarkdown(value)
      const hast = raw(toHast(mdast, { allowDangerousHtml: true }))
      const exHast = hastExcerpt(hast, { comment: separator, maxSearchSize: 1024 })
      const output = exHast ?? truncate(hast, { size: length, ellipsis: '…' })
      await rehypeCopyLinkedFiles(config.output)(output, { path })
      return toHtml(output)
    } catch (err: any) {
      ctx.addIssue({ fatal: true, code: 'custom', message: err.message })
      return value
    }
  })
```

## Velite API Reference
[Skip to content](https://velite.js.org/reference/api#VPContent)

On this page

# API Reference [​](https://velite.js.org/reference/api\#api-reference)

## `build` [​](https://velite.js.org/reference/api\#build)

Build your project.

### Usage [​](https://velite.js.org/reference/api\#usage)

ts

```
import { build } from 'velite'
```

### Signature [​](https://velite.js.org/reference/api\#signature)

ts

```
const build: (options?: Options) => Promise<Result>
```

### Parameters [​](https://velite.js.org/reference/api\#parameters)

#### `options` [​](https://velite.js.org/reference/api\#options)

- Type: `Options`, See [Options](https://velite.js.org/reference/api#options).

Options for build.

#### `options.config` [​](https://velite.js.org/reference/api\#options-config)

- Type: `string`

Specify the config file path.

#### `options.clean` [​](https://velite.js.org/reference/api\#options-clean)

- Type: `boolean`
- Default: `false`

Clean output directories before build.

#### `options.watch` [​](https://velite.js.org/reference/api\#options-watch)

- Type: `boolean`
- Default: `false`

Watch files and rebuild on changes.

#### `options.logLevel` [​](https://velite.js.org/reference/api\#options-loglevel)

- Type: `'debug' | 'info' | 'warn' | 'error' | 'silent'`
- Default: `'info'`

Log level.

#### `options.strict` [​](https://velite.js.org/reference/api\#options-strict)

- Type: `boolean`
- Default: `false`

If true, throws an error and terminates the process if any schema validation fails. Otherwise, a warning is logged but the process does not terminate.

### Returns [​](https://velite.js.org/reference/api\#returns)

- Type: `Promise<Result>`, See [Result](https://velite.js.org/reference/api#result).

The build result.

### Types [​](https://velite.js.org/reference/api\#types)

#### Options [​](https://velite.js.org/reference/api\#options-1)

ts

```
interface Options {
  /**
   * Specify config file path
   * @default 'velite.config.{js,ts,mjs,mts,cjs,cts}'
   */
  config?: string
  /**
   * Clean output directories before build
   * @default false
   */
  clean?: boolean
  /**
   * Watch files and rebuild on changes
   * @default false
   */
  watch?: boolean
  /**
   * Log level
   * @default 'info'
   */
  logLevel?: LogLevel
}
```

#### Result [​](https://velite.js.org/reference/api\#result)

ts

```
interface Entry {
  [key: string]: any
}

/**
 * build result, may be one or more entries in a document file
 */
interface Result {
  [name: string]: Entry | Entry[]
}
```

## `outputFile` [​](https://velite.js.org/reference/api\#outputfile)

### Signature [​](https://velite.js.org/reference/api\#signature-1)

ts

```
const outputFile: async <T extends string | undefined>(ref: T, fromPath: string) => Promise<T>
```

## `outputImage` [​](https://velite.js.org/reference/api\#outputimage)

### Signature [​](https://velite.js.org/reference/api\#signature-2)

ts

```
const outputImage: async <T extends string | undefined>(ref: T, fromPath: string) => Promise<Image | T>
```

## `cache` [​](https://velite.js.org/reference/api\#cache)

- `loaded:${path}`: VFile of loaded file.

...

## Velite Motivation
[Skip to content](https://velite.js.org/guide/motivation#VPContent)

Return to top

# Motivation [​](https://velite.js.org/guide/motivation\#motivation)

TIP

This documentation is still being written. Please check back later.

## Velite Roadmap
[Skip to content](https://velite.js.org/other/roadmap#VPContent)

Return to top

# Roadmap [​](https://velite.js.org/other/roadmap\#roadmap)

The following are the features I want to achieve or are under development:

- \[ \] Incremental build
- \[ \] Full documentation
- \[ \] More built-in schemas
- \[ \] Unit & E2E tests?
- \[ \] Turborepo?
- \[ \] Scoffolding tool
- \[ \] Next.js plugin package
- \[ \] More examples

See the [open issues](https://github.com/zce/velite/issues) for a list of proposed features (and known issues).

## Velite FAQ
[Skip to content](https://velite.js.org/other/faq#VPContent)

Return to top

# FAQ [​](https://velite.js.org/other/faq\#faq)

## TypeScript Guide
[Skip to content](https://velite.js.org/guide/typescript#VPContent)

Return to top

# TypeScript [​](https://velite.js.org/guide/typescript\#typescript)

Velite loves TypeScript, and Velite is written in TypeScript. Velite provides a set of TypeScript types to help you build your own content model.

TIP

This documentation is still being written. Please check back later.

## Code Highlighting Guide
[Skip to content](https://velite.js.org/guide/code-highlighting#VPContent)

On this page

# Code Highlighting [​](https://velite.js.org/guide/code-highlighting\#code-highlighting)

Velite doesn't include built-in code highlighting features because not all content contains code, and that syntax highlighting often comes with custom styles. But you can easily implement it yourself with build-time plugins or client-side highlighters.

TIP

Code highlighting in Build-time is recommended, because it is faster and more stable.

## @shikijs/rehype [​](https://velite.js.org/guide/code-highlighting\#shikijs-rehype)

> [shiki](https://shiki.style/) is a beautiful syntax highlighter for code blocks.

npmpnpmyarn

sh

```
$ npm install @shikijs/rehype shiki
```

sh

```
$ pnpm add @shikijs/rehype shiki
```

sh

```
$ yarn add @shikijs/rehype shiki
```

In your `velite.config.ts`:

ts

```
import rehypeShiki from '@shikijs/rehype'
import { defineConfig } from 'velite'

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [\
      [\
        rehypeShiki as any, // eslint-disable-line @typescript-eslint/no-explicit-any\
        { theme: 'one-dark-pro' }\
      ]\
    ]
  }
})
```

### Transformers [​](https://velite.js.org/guide/code-highlighting\#transformers)

Shiki provides a `transformers` option to customize the output of the syntax highlighting. You can use it to add line highlighting, line numbers, etc.

npmpnpmyarn

sh

```
$ npm install @shikijs/transformers
```

sh

```
$ pnpm add @shikijs/transformers
```

sh

```
$ yarn add @shikijs/transformers
```

ts

```
import rehypeShiki from '@shikijs/rehype'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight } from '@shikijs/transformers'
import { defineConfig } from 'velite'

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [\
      [\
        rehypeShiki as any, // eslint-disable-line @typescript-eslint/no-explicit-any\
        {\
          transformers: [\
            transformerNotationDiff({ matchAlgorithm: 'v3' }),\
            transformerNotationHighlight({ matchAlgorithm: 'v3' }),\
            transformerNotationFocus({ matchAlgorithm: 'v3' }),\
            transformerNotationErrorLevel({ matchAlgorithm: 'v3' })\
          ]\
        }\
      ]\
    ]
  }
})
```

### Copy button [​](https://velite.js.org/guide/code-highlighting\#copy-button)

Shiki doesn't provide a copy button by default, but you can add one with a build-time plugin.

ts

```
import rehypeShiki from '@shikijs/rehype'
import { defineConfig } from 'velite'

const transformerCopyButton = (): ShikiTransformer => ({
  name: 'copy-button',
  pre(node) {
    node.children.push({
      type: 'element',
      tagName: 'button',
      properties: {
        type: 'button',
        className: 'copy',
        title: 'Copy to clipboard',
        onclick: `
          navigator.clipboard.writeText(this.previousSibling.textContent),
          this.className='copied',
          this.title='Copied!',
          setTimeout(()=>this.className='copy',5000)`.replace(/\s+/g, '')
      },
      children: [\
        {\
          type: 'element',\
          tagName: 'svg',\
          properties: {\
            viewBox: '0 0 24 24',\
            fill: 'none',\
            stroke: 'currentColor',\
            strokeWidth: '1.5',\
            strokeLinecap: 'round',\
            strokeLinejoin: 'round'\
          },\
          children: [\
            {\
              type: 'element',\
              tagName: 'rect',\
              properties: {\
                width: '8',\
                height: '4',\
                x: '8',\
                y: '2',\
                rx: '1',\
                ry: '1'\
              },\
              children: []\
            },\
            {\
              type: 'element',\
              tagName: 'path',\
              properties: {\
                d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'\
              },\
              children: []\
            },\
            {\
              type: 'element',\
              tagName: 'path',\
              properties: {\
                class: 'check',\
                d: 'm9 14 2 2 4-4'\
              },\
              children: []\
            }\
          ]\
        }\
      ]
    })
  }
})

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [\
      [\
        rehypeShiki as any, // eslint-disable-line @typescript-eslint/no-explicit-any\
        {\
          transformers: [transformerCopyButton()]\
        }\
      ]\
    ]
  }
})
```

css

```
pre.shiki {
  @apply max-h-(--max-height,80svh) relative flex flex-col overflow-hidden p-0;

  code {
    @apply grid overflow-auto py-5;
  }

  .line {
    @apply relative px-5;
  }

  button {
    @apply hover:opacity-100! absolute right-3 top-3 flex cursor-pointer select-none items-center justify-center rounded-md bg-slate-600 text-sm font-medium text-white opacity-0 shadow outline-0 transition;

    svg {
      @apply m-2 size-5;
    }

    .check {
      @apply opacity-0 transition-opacity;
    }

    &.copied {
      @apply opacity-100!;

      &::before {
        @apply border-r border-[#0002] p-2 px-2.5 content-['Copied!'];
      }

      .check {
        @apply opacity-100;
      }
    }
  }

  &:hover {
    button {
      @apply opacity-80;
    }
  }
}
```

If you want to add more useful transformers, you can refer to the [shiki transformers](https://shiki.style/guide/transformers) documentation.

## rehype-pretty-code [​](https://velite.js.org/guide/code-highlighting\#rehype-pretty-code)

> [rehype-pretty-code](https://rehype-pretty-code.netlify.app/) is a rehype plugin to format code blocks.

npmpnpmyarn

sh

```
$ npm install rehype-pretty-code shiki
```

sh

```
$ pnpm add rehype-pretty-code shiki
```

sh

```
$ yarn add rehype-pretty-code shiki
```

In your `velite.config.js`:

js

```
import rehypePrettyCode from 'rehype-pretty-code'
import { defineConfig } from 'velite'

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [rehypePrettyCode]
  }
})
```

`rehype-pretty-code` creates the proper HTML structure for syntax highlighting, you can then add styles however you like. Here is an example stylesheet:

css

```
[data-rehype-pretty-code-figure] pre {
  @apply px-0;
}

[data-rehype-pretty-code-figure] code {
  @apply text-sm !leading-loose md:text-base;
}

[data-rehype-pretty-code-figure] code[data-line-numbers] {
  counter-reset: line;
}

[data-rehype-pretty-code-figure] code[data-line-numbers] > [data-line]::before {
  counter-increment: line;
  content: counter(line);
  @apply mr-4 inline-block w-4 text-right text-gray-500;
}

[data-rehype-pretty-code-figure] [data-line] {
  @apply border-l-2 border-l-transparent px-3;
}

[data-rehype-pretty-code-figure] [data-highlighted-line] {
  background: rgba(200, 200, 255, 0.1);
  @apply border-l-blue-400;
}

[data-rehype-pretty-code-figure] [data-highlighted-chars] {
  @apply rounded bg-zinc-600/50;
  box-shadow: 0 0 0 4px rgb(82 82 91 / 0.5);
}

[data-rehype-pretty-code-figure] [data-chars-id] {
  @apply border-b-2 p-1 shadow-none;
}
```

Refer to [examples](https://github.com/zce/velite/blob/main/examples/nextjs/velite.config.ts) for more details.

## @shikijs/rehype [​](https://velite.js.org/guide/code-highlighting\#shikijs-rehype-1)

npmpnpmyarn

sh

```
$ npm install @shikijs/rehype
```

sh

```
$ pnpm add @shikijs/rehype
```

sh

```
$ yarn add @shikijs/rehype
```

In your `velite.config.js`:

js

```
import rehypeShiki from '@shikijs/rehype'
import { defineConfig } from 'velite'

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [[rehypeShiki, { theme: 'nord' }]]
  }
})
```

TIP

Velite packages most types of third-party modules, this leads to incompatible type declarations for `@shikijs/rehype`, but you can use it with confidence

In your `velite.config.ts`:

js

```
import rehypeShiki from '@shikijs/rehype'
import { defineConfig } from 'velite'

  markdown: {// `mdx` if you use mdx
export default defineConfig({
    rehypePlugins: [[rehypeShiki as any, { theme: 'nord' }]]
  }
})
```

## rehype-highlight [​](https://velite.js.org/guide/code-highlighting\#rehype-highlight)

> syntax highlighting to code with [lowlight](https://github.com/wooorm/lowlight).

npmpnpmyarn

sh

```
$ npm install rehype-highlight
```

sh

```
$ pnpm add rehype-highlight
```

sh

```
$ yarn add rehype-highlight
```

In your `velite.config.js`:

js

```
import rehypeHighlight from 'rehype-highlight'
import { defineConfig } from 'velite'

export default defineConfig({
  // `mdx` if you use mdx
  markdown: {
    rehypePlugins: [rehypeHighlight]
  }
})
```

## Client-side [​](https://velite.js.org/guide/code-highlighting\#client-side)

You can use [prismjs](https://prismjs.com/) or [shiki](https://shiki.matsu.io/) to highlight code on the client side. Client-side highlighting does not add build overhead to Velite.

For example:

js

```
import { codeToHtml } from 'https://esm.sh/shikiji'

Array.from(document.querySelectorAll('pre code[class*="language-"]')).map(async block => {
  block.parentElement.outerHTML = await codeToHtml(block.textContent, { lang: block.className.slice(9), theme: 'nord' })
})
```

TIP

If you have a large of number of documents that need to be syntax highlighted, it is recommended to use the client-side method. Because syntax highlighting and parsing can be very time-consuming, and it will greatly affect the construction speed of Velite.

## Velite with Next.js
[Skip to content](https://velite.js.org/guide/with-nextjs#VPContent)

On this page

# Integration with Next.js [​](https://velite.js.org/guide/with-nextjs\#integration-with-next-js)

Velite is a framework agnostic library, it can be used in any JavaScript framework or library, including Next.js.

Here are some recipes for help you better integrate Velite with Next.js.

## 🎊 Start Velite with Next.js Config 🆕 [​](https://velite.js.org/guide/with-nextjs\#%F0%9F%8E%8A-start-velite-with-next-js-config-%F0%9F%86%95)

Next.js is gradually adopting Turbopack because it is significantly faster. However, Turbopack is not fully compatible with the Webpack ecosystem, which means that the `VeliteWebpackPlugin` does not function correctly when Turbopack is enabled. Here is a completely new solution.

next.config.tsnext.config.mjs

ts

```
import type { NextConfig } from 'next'

const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  import('velite').then(m => m.build({ watch: isDev, clean: !isDev }))
}

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
```

js

```
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
export default {
  // next config here...
}
```

Note that this approach uses top-level await, so it only supports `next.config.mjs` or ESM enabled.

## Start Velite with Next.js Webpack Plugin [​](https://velite.js.org/guide/with-nextjs\#start-velite-with-next-js-webpack-plugin)

You can use the Next.js plugin to call Velite's programmatic API to start Velite with better integration.

In `next.config.js`:

CommonJSESM

js

```
/** @type {import('next').NextConfig} */
module.exports = {
  // othor next config here...
  webpack: config => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  }
}

class VeliteWebpackPlugin {
  static started = false
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      const { build } = await import('velite')
      await build({ watch: dev, clean: !dev })
    })
  }
}
```

js

```
import { build } from 'velite'

/** @type {import('next').NextConfig} */
export default {
  // othor next config here...
  webpack: config => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  }
}

class VeliteWebpackPlugin {
  static started = false
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      await build({ watch: dev, clean: !dev })
    })
  }
}
```

INFO

ESM `import { build } from 'velite'` may be got a `[webpack.cache.PackFileCacheStrategy/webpack.FileSystemInfo]` warning generated during the `next build` process, which has little impact, refer to [https://github.com/webpack/webpack/pull/15688](https://github.com/webpack/webpack/pull/15688)

or [👆](https://velite.js.org/guide/with-nextjs#%F0%9F%8E%8A-start-velite-with-next-js-config-%F0%9F%86%95)

## Start Velite in npm script with `npm-run-all`: [​](https://velite.js.org/guide/with-nextjs\#start-velite-in-npm-script-with-npm-run-all)

INFO

`VeliteWebpackPlugin` is recommended, but if your project is deployed on Vercel, there may be an error of `free(): invalid size` or `munmap_chunk(): invalid pointer `, which is usually related to the sharp module. Please refer to: [https://github.com/zce/velite/issues/52#issuecomment-2016789204](https://github.com/zce/velite/issues/52#issuecomment-2016789204)

**package.json**:

json

```
{
  "scripts": {
    "dev:content": "velite --watch",
    "build:content": "velite --clean",
    "dev:next": "next dev",
    "build:next": "next build",
    "dev": "run-p dev:*",
    "build": "run-s build:*",
    "start": "next start"
  }
}
```

## Typed Routes [​](https://velite.js.org/guide/with-nextjs\#typed-routes)

When you use the `typedRoutes` experimental feature, you can get the typed routes in your Next.js app.

In this case, you can specify a more specific type for the relevant schema to make it easier to use on `next/link` or `next/router`.

e.g.

ts

```
import type { Route } from 'next'
import type { Schema } from 'velite'

const options = defineCollection({
  // ...
  schema: s.object({
    // ...
    link: z.string() as Schema<Route<'/posts/${string}'>>
  })
})
```

Then you can use it like this:

tsx

```
import Link from 'next/link'

import { options } from '@/.velite'

const Post = async () => {
  return (
    <div>
      {/* typed route */}
      <Link href={options.link}>Read more</Link>
    </div>
  )
}
```

## Example [​](https://velite.js.org/guide/with-nextjs\#example)

- [examples/nextjs](https://github.com/zce/velite/tree/main/examples/nextjs)

## Velite Quick Start
[Skip to content](https://velite.js.org/guide/quick-start#VPContent)

On this page

# Quick Start [​](https://velite.js.org/guide/quick-start\#quick-start)

## Installation [​](https://velite.js.org/guide/quick-start\#installation)

### Prerequisites [​](https://velite.js.org/guide/quick-start\#prerequisites)

- [Node.js](https://nodejs.org/) version 18.17 or higher, LTS version is recommended.
- macOS, Windows, and Linux are supported.

npmpnpmyarnbun

sh

```
$ npm install velite -D
```

sh

```
$ pnpm add velite -D
```

sh

```
$ yarn add velite -D
```

sh

```
$ bun add velite -D
```

Velite is an [ESM-only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) package

Don't use `require()` to import it, and make sure your nearest `package.json` contains `"type": "module"`, or change the file extension of your relevant files like `velite.config.js` to `.mjs`/ `.mts`. Also, inside async CJS contexts, you can use `await import('velite')` instead.

## Define Collections [​](https://velite.js.org/guide/quick-start\#define-collections)

Create a `velite.config.js` file in the root directory of your project to define collections config:

js

```
import { defineConfig, s } from 'velite'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

export default defineConfig({
  collections: {
    posts: {
      name: 'Post', // collection type name
      pattern: 'posts/**/*.md', // content files glob pattern
      schema: s
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.slug('posts'), // validate format, unique in posts collection
          // slug: s.path(), // auto generate slug from file path
          date: s.isodate(), // input Date-like string, output ISO Date string.
          cover: s.image(), // input image relative path, output image object with blurImage.
          video: s.file().optional(), // input file relative path, output file public path.
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          excerpt: s.excerpt(), // excerpt of markdown content
          content: s.markdown() // transform markdown to html
        })
        // more additional fields (computed fields)
        .transform(data => ({ ...data, permalink: `/blog/${data.slug}` }))
    },
    others: {
      // other collection schema options
    }
  }
})
```

For more information about Velite extended field schemas, see [Velite Schemas](https://velite.js.org/guide/velite-schemas).

TIP

Config file supports TypeScript & ESM & CommonJS. you can use the full power of TypeScript to write your config file, and it's recommended strongly.

## Create Contents Files [​](https://velite.js.org/guide/quick-start\#create-contents-files)

Add your creative content into the `content` directory, like this:

diff

```
 root
+├── content
+│   ├── posts
+│   │   └── hello-world.md
+│   └── others
+│       └── other.yml
 ├── public
 ├── package.json
 └── velite.config.js
```

content/posts/hello-world.md

md

```
---
title: Hello world
slug: hello-world
date: 1992-02-25 13:22
cover: cover.jpg
video: video.mp4
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse

![some image](img.png)

[link to file](plain.txt)
```

## Build Contents by Velite [​](https://velite.js.org/guide/quick-start\#build-contents-by-velite)

Run `velite` command in terminal, then Velite will build the contents and related files.

npmpnpmyarnbun

sh

```
$ npx velite
```

sh

```
$ pnpm velite
```

sh

```
$ yarn velite
```

sh

```
$ bun velite
```

Then you will get the following output:

diff

```
 root
+├── .velite
+│   ├── posts.json                  # posts collection output
+│   ├── others.json                 # others collection output
+│   ├── index.d.ts                  # typescript dts file
+│   └── index.js                    # javascript entry file (esm)
 ├── content
 │   ├── posts
 │   │   ├── hello-world.md
 │   │   └── other.md
 │   └── others
 │       └── other.yml
 ├── public
+│   └── static
+│       ├── cover-2a4138dh.jpg      # from frontmatter reference
+│       ├── img-2hd8f3sd.jpg        # from content reference
+│       ├── plain-37d62h1s.txt      # from content reference
+│       └── video-72hhd9f.mp4       # from frontmatter reference
 ├── package.json
 └── velite.config.js
```

TIP

If you're using Git for version control, we recommend ignoring the `.velite` directory by adding `.velite` to your `.gitignore`. This tells Git to ignore this directory and any files inside of it.

sh

```
echo '\n.velite' >> .gitignore
```

If you have static files output, you also need to ignore the `public/static` directory:

sh

```
echo '\npublic/static' >> .gitignore
```

## Run Velite in Watch Mode [​](https://velite.js.org/guide/quick-start\#run-velite-in-watch-mode)

When the `--watch` flag is used with `velite dev` or `velite`, Velite will watch the contents files and rebuild them automatically when they are changed.

npmpnpmyarnbun

sh

```
$ npx velite dev
[VELITE] output entry file in '.velite' in 0.68ms
[VELITE] output 1 posts, 1 others in 0.47ms
[VELITE] output 2 assets in 1.38ms
[VELITE] build finished in 84.49ms
[VELITE] watching for changes in 'content'
```

sh

```
$ pnpm velite dev
[VELITE] output entry file in '.velite' in 0.68ms
[VELITE] output 1 posts, 1 others in 0.47ms
[VELITE] output 2 assets in 1.38ms
[VELITE] build finished in 84.49ms
[VELITE] watching for changes in 'content'
```

sh

```
$ yarn velite dev
[VELITE] output entry file in '.velite' in 0.68ms
[VELITE] output 1 posts, 1 others in 0.47ms
[VELITE] output 2 assets in 1.38ms
[VELITE] build finished in 84.49ms
[VELITE] watching for changes in 'content'
```

sh

```
$ bun velite dev
[VELITE] output entry file in '.velite' in 0.68ms
[VELITE] output 1 posts, 1 others in 0.47ms
[VELITE] output 2 assets in 1.38ms
[VELITE] build finished in 84.49ms
[VELITE] watching for changes in 'content'
```

For more information about define collections, see [Define Collections](https://velite.js.org/guide/define-collections).

## Use Output in Your Project [​](https://velite.js.org/guide/quick-start\#use-output-in-your-project)

Velite will generate a `index.js` file in `.velite` directory, you can import it in your project:

js

```
import { posts } from './.velite'

console.log(posts) // => [{ title: 'Hello world', slug: 'hello-world', ... }, ...]
```

TIP

Velite is **Framework Agnostic**, you can use it output with any framework or library you like.

From version `0.2.0`, Velite will output the entry file in the format you specified in the config. so you can choose the format you like.

For more information about using collections, see [Using Collections](https://velite.js.org/guide/using-collections).

## Using MDX with Velite
[Skip to content](https://velite.js.org/guide/using-mdx#VPContent)

On this page

# MDX Support [​](https://velite.js.org/guide/using-mdx\#mdx-support)

Velite supports MDX out of the box. You can use MDX to write your content, and Velite will automatically render it for you.

Some examples that may help you:

- [examples/nextjs](https://github.com/zce/velite/tree/main/examples/nextjs) \- A Next.js and MDX example.
- [zce/taxonomy](https://github.com/zce/taxonomy) \- A fork of [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy) using Velite.

## Getting Started [​](https://velite.js.org/guide/using-mdx\#getting-started)

For example, suppose you have the following content structure:

diff

```
project-root
├── content
│   └── posts
│       └── hello-world.mdx
├── public
├── package.json
└── velite.config.js
```

The `./content/posts/hello-world.mdx` document is a MDX document with the following content:

mdx

```
---
title: Hello world
---

export const year = 2023

# Last year’s snowfall

In {year}, the snowfall was above average.
It was followed by a warm spring which caused
flood conditions in many of the nearby rivers.

<Chart year={year} color="#fcb32c" />
```

Use the `s.mdx()` schema to add the compiled MDX code to your content collection.

js

```
import { defineConfig, s } from 'velite'

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s.object({
        title: s.string(),
        code: s.mdx()
      })
    }
  }
})
```

Run `velite build` and you will get the following data structure:

json

```
{
  "posts": [\
    {\
      "title": "Hello world",\
      "code": "const{Fragment:n,jsx:e,jsxs:t}=arguments[0],o=2023;function _createMdxContent(r){const a={h1:\"h1\",p:\"p\",...r.components},{Chart:c}=a;return c||function(n,e){throw new Error(\"Expected \"+(e?\"component\":\"object\")+\" `\"+n+\"` to be defined: you likely forgot to import, pass, or provide it.\")}(\"Chart\",!0),t(n,{children:[e(a.h1,{children:\"Last year’s snowfall\"}),\"\\n\",t(a.p,{children:[\"In \",o,\", the snowfall was above average.\\nIt was followed by a warm spring which caused\\nflood conditions in many of the nearby rivers.\"]}),\"\\n\",e(c,{year:o,color:\"#fcb32c\"})]})}return{year:o,default:function(n={}){const{wrapper:t}=n.components||{};return t?e(t,{...n,children:e(_createMdxContent,{...n})}):_createMdxContent(n)}};"\
    }\
  ]
}
```

By default, Velite will compile the MDX content into a function-body string, which can be used to render the content in your application.

## Rendering MDX Content [​](https://velite.js.org/guide/using-mdx\#rendering-mdx-content)

First, you can create a generic component for rendering the compiled mdx code. It should accept the code and a list of components that are used in the MDX content.

`./components/mdx-content.tsx`:

tsx

```
import * as runtime from 'react/jsx-runtime'

const sharedComponents = {
  // Add your global components here
}

// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

// MDXContent component
export const MDXContent = ({ code, components }: MDXProps) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
```

Then, you can use the `MDXContent` component to render the MDX content:

`./pages/posts/[slug].tsx`:

tsx

```
import { posts } from '@/.velite'
import { Chart } from '@/components/chart' // import your custom components
import { MDXContent } from '@/components/mdx-content'

export default function Post({ params: { slug } }) {
  const post = posts.find(i => i.slug === slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <MDXContent code={post.code} components={{ Chart }} />
    </article>
  )
}
```

## FAQ [​](https://velite.js.org/guide/using-mdx\#faq)

### How to import components in MDX? [​](https://velite.js.org/guide/using-mdx\#how-to-import-components-in-mdx)

You don't need to, since Velite's `s.mdx()` schema does not bundle those components at build time. There is no need to construct a import tree. This can help reduce output size for your contents.

For example, suppose you extract a common component for multiple MDXs and import the component in these MDXs.

./components/callout.tsx./posts/foo.mdx./posts/bar.mdx

tsx

```
export const Callout = ({ children }: { children: React.ReactNode }) => {
  // your common component
  return <div style={{ border: '1px solid #ddd', padding: '1rem' }}>{children}</div>
}
```

mdx

```
---
title: Foo
---

import { Callout } from '../components/callout'

# Foo

<Callout>This is foo callout.</Callout>
```

mdx

```
---
title: Bar
---

import { Callout } from '../components/callout'

# Bar

<Callout>This is bar callout.</Callout>
```

If Velite uses a bundler to compile your MDX, the `Callout` component will be bundled into each MDX file, which will cause a lot of redundancy in the output code.

Instead, simply use whatever components you want in your MDX files without a import.

./posts/foo.mdx./posts/bar.mdx

mdx

```
---
title: Foo
---

# Foo

<Callout>This is foo callout.</Callout>
```

mdx

```
---
title: Bar
---

# Bar

<Callout>This is bar callout.</Callout>
```

Then, inject the components into the `MDXContent` component:

tsx

```
import { Callout } from '@/components/callout'
import { MDXContent } from '@/components/mdx-content'

export default function Post({ params: { slug } }) {
  const post = posts.find(i => i.slug === slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <MDXContent code={post.code} components={{ Callout }} />
    </article>
  )
}
```

You can also add global components so that they are available to all MDX files.

tsx

```
import * as runtime from 'react/jsx-runtime'

import { Callout } from '@/components/callout'

const sharedComponents = {
  // Add your global components here
  Callout
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export const MDXContent = ({ code, components }: MDXProps) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
```

### What if I want to bundle MDX? [​](https://velite.js.org/guide/using-mdx\#what-if-i-want-to-bundle-mdx)

If you can make do with the increased output size, bundling MDX can be a good option for better portability.

You can install the following packages to bundle MDX:

bash

```
npm i esbuild @fal-works/esbuild-plugin-global-externals @mdx-js/esbuild --save-dev
```

Then, create a custom schema for MDX bundling:

CAUTION

The following code is just a simple example. You may need to adjust it according to your actual situation.

ts

```
import { dirname, join } from 'node:path'
import { globalExternals } from '@fal-works/esbuild-plugin-global-externals'
import mdxPlugin from '@mdx-js/esbuild'
import { build } from 'esbuild'

import type { Plugin } from 'esbuild'

const compileMdx = async (source: string, path: string, options: CompileOptions): Promise<string> => {
  const virtualSourse: Plugin = {
    name: 'virtual-source',
    setup: build => {
      build.onResolve({ filter: /^__faker_entry/ }, args => {
        return {
          path: join(args.resolveDir, args.path),
          pluginData: { contents: source } // for mdxPlugin
        }
      })
    }
  }

  const bundled = await build({
    entryPoints: [`__faker_entry.mdx`],
    absWorkingDir: dirname(path),
    write: false,
    bundle: true,
    target: 'node18',
    platform: 'neutral',
    format: 'esm',
    globalName: 'VELITE_MDX_COMPONENT',
    treeShaking: true,
    jsx: 'automatic',
    minify: true,
    plugins: [\
      virtualSourse,\
      mdxPlugin({}),\
      globalExternals({\
        react: {\
          varName: 'React',\
          type: 'cjs'\
        },\
        'react-dom': {\
          varName: 'ReactDOM',\
          type: 'cjs'\
        },\
        'react/jsx-runtime': {\
          varName: '_jsx_runtime',\
          type: 'cjs'\
        }\
      })\
    ]
  })

  return bundled.outputFiles[0].text.replace('var VELITE_MDX_COMPONENT=', 'return ')
}

export const mdxBundle = (options: MdxOptions = {}) =>
  custom<string>().transform<string>(async (value, { meta: { path, content, config }, addIssue }) => {
    value = value ?? content
    if (value == null) {
      addIssue({ fatal: true, code: 'custom', message: 'The content is empty' })
      return null as never
    }

    const enableGfm = options.gfm ?? config.mdx?.gfm ?? true
    const enableMinify = options.minify ?? config.mdx?.minify ?? true
    const removeComments = options.removeComments ?? config.mdx?.removeComments ?? true
    const copyLinkedFiles = options.copyLinkedFiles ?? config.mdx?.copyLinkedFiles ?? true
    const outputFormat = options.outputFormat ?? config.mdx?.outputFormat ?? 'function-body'

    const remarkPlugins = [] as PluggableList
    const rehypePlugins = [] as PluggableList

    if (enableGfm) remarkPlugins.push(remarkGfm) // support gfm (autolink literals, footnotes, strikethrough, tables, tasklists).
    if (removeComments) remarkPlugins.push(remarkRemoveComments) // remove html comments
    if (copyLinkedFiles) remarkPlugins.push([remarkCopyLinkedFiles, config.output]) // copy linked files to public path and replace their urls with public urls
    if (options.remarkPlugins != null) remarkPlugins.push(...options.remarkPlugins) // apply remark plugins
    if (options.rehypePlugins != null) rehypePlugins.push(...options.rehypePlugins) // apply rehype plugins
    if (config.mdx?.remarkPlugins != null) remarkPlugins.push(...config.mdx.remarkPlugins) // apply global remark plugins
    if (config.mdx?.rehypePlugins != null) rehypePlugins.push(...config.mdx.rehypePlugins) // apply global rehype plugins

    const compilerOptions = { ...config.mdx, ...options, outputFormat, remarkPlugins, rehypePlugins }

    try {
      return await compileMdx(value, path, compilerOptions)
    } catch (err: any) {
      addIssue({ fatal: true, code: 'custom', message: err.message })
      return null as never
    }
  })
```

Then, you can use the custom schema in your `velite.config.js`:

js

```
import { defineConfig, s } from 'velite'

import { mdxBundle } from './mdx'

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s.object({
        title: s.string(),
        code: mdxBundle()
      })
    }
  }
})
```

## Velite Schemas Guide
[Skip to content](https://velite.js.org/guide/velite-schemas#VPContent)

On this page

# Velite Schemas [​](https://velite.js.org/guide/velite-schemas\#velite-schemas)

To use Zod in Velite, import the `z` utility from `'velite'`. This is a re-export of the Zod library, and it supports all of the features of Zod.

See [Zod's Docs](https://zod.dev/) for complete documentation on how Zod works and what features are available.

js

```
import { z } from 'velite'

// `z` is re-export of Zod
```

In addition, Velite has extended Zod schemas, added some commonly used features when building content models, you can import `s` from `'velite'` to use these extended schemas.

js

```
import { s } from 'velite'

// `s` is extended from Zod with some custom schemas,
// `s` also includes all members of zod, so you can use `s` as `z`
```

## `s.isodate()` [​](https://velite.js.org/guide/velite-schemas\#s-isodate)

`string => string`

Format date string to ISO date string.

ts

```
date: s.isodate()
// case 1. valid date string
// '2017-01-01' => '2017-01-01T00:00:00.000Z'

// case 2. valid datetime string
// '2017-01-01 10:10:10' => '2017-01-01T10:10:10.000Z'

// case 3. invalid date string
// 'foo bar invalid' => issue 'Invalid date string'
```

## `s.unique(by)` [​](https://velite.js.org/guide/velite-schemas\#s-unique-by)

`string => string`

validate unique value in collections.

ts

```
name: s.unique('taxonomies')
// case 1. unique value
// 'foo' => 'foo'

// case 2. non-unique value (in all unique by 'taxonomies')
// 'foo' => issue 'Already exists'
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters)

#### **by**: unique identifier [​](https://velite.js.org/guide/velite-schemas\#by-unique-identifier)

- type: `string`
- default: `'global'`

## `s.slug(by, reserved)` [​](https://velite.js.org/guide/velite-schemas\#s-slug-by-reserved)

`string => string`

base on `s.unique()`, unique in collections, not allow reserved values, and validate slug format.

ts

```
slug: s.slug('taxonomies', ['admin', 'login'])
// case 1. unique slug value
// 'hello-world' => 'hello-world'

// case 2. non-unique value (in all unique by 'taxonomies')
// 'hello-world' => issue 'Slug already exists'

// case 3. reserved slug value
// 'admin' => issue 'Slug is reserved'

// case 4. invalid slug value
// 'Hello World' => issue 'Invalid slug'
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-1)

#### **by**: unique identifier [​](https://velite.js.org/guide/velite-schemas\#by-unique-identifier-1)

- type: `string`
- default: `'global'`

#### **reserved**: reserved values [​](https://velite.js.org/guide/velite-schemas\#reserved-reserved-values)

- type: `string[]`
- default: `[]`

## `s.file(options)` [​](https://velite.js.org/guide/velite-schemas\#s-file-options)

`string => string`

file path relative to this file, copy file to `config.output.assets` directory and return the public url.

ts

```
avatar: s.file()
// case 1. relative path
// 'avatar.png' => '/static/avatar-34kjfdsi.png'

// case 2. non-exists file
// 'not-exists.png' => issue 'File not exists'

// case 3. absolute path or full url (if allowed)
// '/icon.png' => '/icon.png'
// 'https://zce.me/logo.png' => 'https://zce.me/logo.png'
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-2)

##### **options.allowNonRelativePath**: [​](https://velite.js.org/guide/velite-schemas\#options-allownonrelativepath)

allow non-relative path, if true, the value will be returned directly, if false, the value will be processed as a relative path

- type: `boolean`
- default: `true`

## `s.image(options)` [​](https://velite.js.org/guide/velite-schemas\#s-image-options)

`string => Image`

image path relative to this file, like `s.file()`, copy file to `config.output.assets` directory and return the [Image](https://velite.js.org/guide/velite-schemas#types) (image object with meta data).

ts

```
avatar: s.image()
// case 1. relative path
// 'avatar.png' => {
//   src: '/static/avatar-34kjfdsi.png',
//   width: 100,
//   height: 100,
//   blurDataURL: 'data:image/png;base64,xxx',
//   blurWidth: 8,
//   blurHeight: 8
// }

// case 2. non-exists file
// 'not-exists.png' => issue 'File not exists'

// case 3. absolute path or full url (if allowed)
// '/icon.png' => { src: '/icon.png', width: 0, height: 0, blurDataURL: '', blurWidth: 0, blurHeight: 0 }
// 'https://zce.me/logo.png' => { src: 'https://zce.me/logo.png', width: 0, height: 0, blurDataURL: '', blurWidth: 0, blurHeight: 0 }
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-3)

##### **options.absoluteRoot**: [​](https://velite.js.org/guide/velite-schemas\#options-absoluteroot)

root path for absolute path, if provided, the value will be processed as an absolute path.

- type: `string`
- default: `undefined`

### Types [​](https://velite.js.org/guide/velite-schemas\#types)

ts

```
/**
 * Image object with metadata & blur image
 */
interface Image {
  /**
   * public url of the image
   */
  src: string
  /**
   * image width
   */
  width: number
  /**
   * image height
   */
  height: number
  /**
   * blurDataURL of the image
   */
  blurDataURL: string
  /**
   * blur image width
   */
  blurWidth: number
  /**
   * blur image height
   */
  blurHeight: number
}
```

## `s.metadata()` [​](https://velite.js.org/guide/velite-schemas\#s-metadata)

`string => Metadata`

parse input or document body as markdown content and return [Metadata](https://velite.js.org/guide/velite-schemas#types-1).

currently only support `readingTime` & `wordCount`.

ts

```
metadata: s.metadata()
// document body => { readingTime: 2, wordCount: 100 }
```

### Types [​](https://velite.js.org/guide/velite-schemas\#types-1)

ts

```
/**
 * Document metadata.
 */
interface Metadata {
  /**
   * Reading time in minutes.
   */
  readingTime: number
  /**
   * Word count.
   */
  wordCount: number
}
```

## `s.excerpt(options)` [​](https://velite.js.org/guide/velite-schemas\#s-excerpt-options)

`string => string`

parse input or document body as markdown content and return excerpt text.

ts

```
excerpt: s.excerpt()
// document body => excerpt text
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-4)

#### **options**: excerpt options [​](https://velite.js.org/guide/velite-schemas\#options-excerpt-options)

##### **options.length**: [​](https://velite.js.org/guide/velite-schemas\#options-length)

excerpt length.

- type: `number`
- default: `260`

## `s.markdown(options)` [​](https://velite.js.org/guide/velite-schemas\#s-markdown-options)

`string => string`

parse input or document body as markdown content and return html content. refer to [Markdown Support](https://velite.js.org/guide/using-markdown) for more information.

ts

```
content: s.markdown()
// => html content
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-5)

#### **options**: markdown options [​](https://velite.js.org/guide/velite-schemas\#options-markdown-options)

- type: `MarkdownOptions`, See [MarkdownOptions](https://velite.js.org/reference/types#markdownoptions)
- default: `{ gfm: true, removeComments: true, copyLinkedFiles: true }`

## `s.mdx(options)` [​](https://velite.js.org/guide/velite-schemas\#s-mdx-options)

`string => string`

parse input or document body as mdx content and return component function-body. refer to [MDX Support](https://velite.js.org/guide/using-mdx) for more information.

ts

```
code: s.mdx()
// => function-body
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-6)

#### **options**: mdx options [​](https://velite.js.org/guide/velite-schemas\#options-mdx-options)

- type: `MdxOptions`, See [MdxOptions](https://velite.js.org/reference/types#mdxoptions)
- default: `{ gfm: true, removeComments: true, copyLinkedFiles: true }`

## `s.raw()` [​](https://velite.js.org/guide/velite-schemas\#s-raw)

`string => string`

return raw document body.

ts

```
code: s.raw()
// => raw document body
```

## `s.toc(options)` [​](https://velite.js.org/guide/velite-schemas\#s-toc-options)

`string => TocEntry[] | TocTree`

parse input or document body as markdown content and return the [table of contents](https://velite.js.org/guide/velite-schemas#types-2).

ts

```
toc: s.toc()
// document body => table of contents
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-7)

#### **options**: toc options [​](https://velite.js.org/guide/velite-schemas\#options-toc-options)

- type: `TocOptions`, See [Options](https://github.com/syntax-tree/mdast-util-toc?tab=readme-ov-file#options)

##### **options.original**: [​](https://velite.js.org/guide/velite-schemas\#options-original)

keep the original table of contents.

- type: `boolean`
- default: `false`

### Types [​](https://velite.js.org/guide/velite-schemas\#types-2)

ts

```
interface TocEntry {
  /**
   * Title of the entry
   */
  title: string
  /**
   * URL that can be used to reach
   * the content
   */
  url: string
  /**
   * Nested items
   */
  items: TocEntry[]
}

/**
 * Tree for table of contents
 */
export interface TocTree {
  /**
   *  Index of the node right after the table of contents heading, `-1` if no
   *  heading was found, `undefined` if no `heading` was given.
   */
  index?: number
  /**
   *  Index of the first node after `heading` that is not part of its section,
   *  `-1` if no heading was found, `undefined` if no `heading` was given, same
   *  as `index` if there are no nodes between `heading` and the first heading
   *  in the table of contents.
   */
  endIndex?: number
  /**
   *  List representing the generated table of contents, `undefined` if no table
   *  of contents could be created, either because no heading was found or
   *  because no following headings were found.
   */
  map?: List
}
```

Refer to [mdast-util-toc](https://github.com/syntax-tree/mdast-util-toc) for more information about `Result` and `Options`.

## `s.path(options)` [​](https://velite.js.org/guide/velite-schemas\#s-path-options)

`=> string`

get flattened path based on the file path.

ts

```
path: s.path()
// => flattened path, e.g. 'posts/2021-01-01-hello-world'
```

### Parameters [​](https://velite.js.org/guide/velite-schemas\#parameters-8)

#### **options**: flattening options [​](https://velite.js.org/guide/velite-schemas\#options-flattening-options)

- type: `PathOptions`

##### **options.removeIndex**: [​](https://velite.js.org/guide/velite-schemas\#options-removeindex)

Removes `index` from the path.

- type: `boolean`
- default: `true`

## Zod Primitive Types [​](https://velite.js.org/guide/velite-schemas\#zod-primitive-types)

In addition, all Zod's built-in schemas can be used normally, such as:

ts

```
title: s.string().mix(3).max(100)
description: s.string().optional()
featured: s.boolean().default(false)
```

You can refer to [https://zod.dev](https://zod.dev/) get complete support documentation.

## Define a Custom Schema [​](https://velite.js.org/guide/velite-schemas\#define-a-custom-schema)

Refer to [Custom Schema](https://velite.js.org/guide/custom-schema) for more information about custom schema.

## Define Content Collections
[Skip to content](https://velite.js.org/guide/define-collections#VPContent)

On this page

# Define Collections [​](https://velite.js.org/guide/define-collections\#define-collections)

Content collections are the best way to manage and author content in content-first applications. Velite helps you organize and validate your contents, and provides type-safety through automatic type generations.

## What is a Collection? [​](https://velite.js.org/guide/define-collections\#what-is-a-collection)

A **content collection** is a group of related content items. For example, a blog might have a collection of **posts**, a collection of **authors**, and a collection of **tags**.

Each collection should be placed in a top-level directory inside the `content` project directory.

diff

```
content
├── authors # => authors collection
│   ├── zce.yml
│   └── jane.yml
├── posts # => posts collection
│   ├── hello-world.md
│   └── another-post.md
└── tags # => tags collection
    └── all-in-one.yml
```

Each collection is defined by a schema, which describes the shape of the content items in the collection.

js

```
import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  /* collection shema options */
})

const authors = defineCollection({
  /* collection shema options */
})

const tags = defineCollection({
  /* collection shema options */
})

export default defineConfig({
  collections: { authors, posts, tags }
})
```

## Collection Schema Options [​](https://velite.js.org/guide/define-collections\#collection-schema-options)

### `name` [​](https://velite.js.org/guide/define-collections\#name)

The name of the collection. This is used to generate the type name for the collection.

js

```
const posts = defineCollection({
  name: 'Post'
})
```

The type name is usually a singular noun, but it can be any valid TypeScript identifier.

### `pattern` [​](https://velite.js.org/guide/define-collections\#pattern)

The glob pattern used to find content files for the collection.

js

```
const posts = defineCollection({
  pattern: 'posts/**/*.md'
  // or pattern: ['posts/**/*.md', '!posts/private/**']
})
```

Velite uses [fast-glob](https://github.com/mrmlnc/fast-glob) to find content files, so you can use any glob pattern supported by fast-glob.

By default, Velite will ignore files and directories that start with `_` or `.`.

### `single` [​](https://velite.js.org/guide/define-collections\#single)

Whether the collection should be treated as a single item. This is useful for collections that only have one content item, such as a site's metadata.

js

```
const site = defineCollection({
  pattern: 'site/index.yml',
  single: true
})
```

### `schema` [​](https://velite.js.org/guide/define-collections\#schema)

Velite uses [Zod](https://zod.dev/) to validate the content items in a collection. The `schema` option is used to define the Zod schema used to validate the content items in the collection.

To use Zod in Velite, import the `z` utility from `'velite'`. This is a re-export of Zod's `z` object, and it supports all of the features of Zod. See [Zod's Docs](https://zod.dev/) for a complete documentation on how Zod works and what features are available.

js

```
import { z } from 'velite'

const posts = defineCollection({
  schema: z.object({
    title: z.string().max(99)
  })
})
```

TIP

The schema is usually a `ZodObject`, validating the shape of the content item. But it can be any valid Zod schema.

For more complex schemas, I recommend that you use [Velite extended schemas `s`](https://velite.js.org/guide/velite-schemas):

- `s.slug()`: validate slug format, unique in posts collection.
- `s.isodate()`: format date string to ISO date string.
- `s.unique()`: validate unique value in collection.
- `s.image()`: input image relpath, output image object with blurImage.
- `s.file()`: input file relpath, output file public path.
- `s.metadata()`: extract markdown reading-time, word-count, etc.
- `s.excerpt()`: excerpt of markdown content
- `s.markdown()`: transform markdown to html
- `s.mdx()`: transform mdx to function code.

For example:

js

```
import { s } from 'velite'

const posts = defineCollection({
  schema: s.object({
    slug: s.slug('posts'),
    date: s.isodate(),
    cover: s.image(),
    video: s.file().optional(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
    content: s.markdown()
  })
})
```

For more information about Velite extended field schema, see [Velite Schemas](https://velite.js.org/guide/velite-schemas).

## Schema Transform (Computed Fields) [​](https://velite.js.org/guide/define-collections\#schema-transform-computed-fields)

Zod schemas can be transformed using the `.transform()` method. This is useful for adding computed fields to the content items in a collection.

js

```
const posts = defineCollection({
  schema: s
    .object({
      slug: s.slug('posts')
    })
    .transform(data => ({
      ...data,
      // computed fields
      permalink: `/blog/${data.slug}`
    }))
})
```

### Transform Context Metadata [​](https://velite.js.org/guide/define-collections\#transform-context-metadata)

The `transform()` function can receive a second argument, which is the context object. This is useful for adding computed fields to the content items in a collection.

js

```
const posts = defineCollection({
  schema: s
    .object({
      // fields
    })
    .transform((data, { meta }) => ({
      ...data,
      // computed fields
      path: meta.path // or parse to filename based slug
    }))
})
```

the type of `meta` is `ZodMeta`, which extends [`VeliteFile`](https://velite.js.org/reference/types#velitefile). for more information, see [Custom Schema](https://velite.js.org/guide/custom-schema).

## Content Body [​](https://velite.js.org/guide/define-collections\#content-body)

Velite's built-in loader keeps content's raw body in `meta.content`, and the plain text body in `meta.plain`.

To add them as a field, you can use a custom schema.

js

```
const posts = defineCollection({
  schema: s.object({
    content: s.custom().transform((data, { meta }) => meta.content),
    plain: s.custom().transform((data, { meta }) => meta.plain)
  })
})
```

TIP

This will keep the original document body, In most cases, you should use `s.markdown()` / `s.mdx()` schema to transform the document body.

### Markdown & MDX [​](https://velite.js.org/guide/define-collections\#markdown-mdx)

In addition to validating the content items in a collection, Velite can also process the content body using [Unified](https://unifiedjs.com/).

js

```
const posts = defineCollection({
  schema: s.object({
    content: s.markdown() // or s.mdx()
  })
})
```

The `content` field will be transformed from markdown to html, and the result will be available in the `content` field of the content item.

#### Reference [​](https://velite.js.org/guide/define-collections\#reference)

- [`s.markdown(options)`](https://velite.js.org/guide/velite-schemas#s-markdown-options)
- [`s.mdx(options)`](https://velite.js.org/guide/velite-schemas#s-mdx-options)

### Metadata [​](https://velite.js.org/guide/define-collections\#metadata)

Velite can extract metadata from content files. This is useful for adding computed fields to the content items in a collection.

js

```
const posts = defineCollection({
  schema: s.object({
    metadata: s.metadata() // extract markdown reading-time, word-count, etc.
  })
})
```

#### Reference [​](https://velite.js.org/guide/define-collections\#reference-1)

- [`s.metadata()`](https://velite.js.org/guide/velite-schemas#s-metadata)

### Excerpt [​](https://velite.js.org/guide/define-collections\#excerpt)

Velite can extract excerpt from content files. This is useful for adding computed fields to the content items in a collection.

js

```
const posts = defineCollection({
  schema: s.object({
    excerpt: s.excerpt({ length: 200 }) // excerpt of the markdown body
  })
})
```

#### Reference [​](https://velite.js.org/guide/define-collections\#reference-2)

- [`s.excerpt(options)`](https://velite.js.org/guide/velite-schemas#s-excerpt)

## Using Velite Collections
[Skip to content](https://velite.js.org/guide/using-collections#VPContent)

On this page

# Using Collections in Your Apps [​](https://velite.js.org/guide/using-collections\#using-collections-in-your-apps)

Velite builds your contents into JSON file, and generates type inference for TypeScript, and you can use the output data in your application with confidence.

## Output Structure [​](https://velite.js.org/guide/using-collections\#output-structure)

diff

```
 root
+├── .velite
+│   ├── posts.json                  # posts collection output
+│   └── others.json                 # others collection output
 ├── content
 │   ├── posts
 │   │   ├── hello-world.md
 │   │   └── hello-world-2.md
 │   └── others
 ├── public
+│   └── static
+│       ├── cover-2a4138dh.jpg      # from frontmatter reference
+│       ├── img-2hd8f3sd.jpg        # from content reference
+│       ├── plain-37d62h1s.txt      # from content reference
+│       └── video-72hhd9f.mp4       # from frontmatter reference
 ├── package.json
 └── velite.config.js
```

in `.velite` directory, Velite generates the output files for each collection, and the `index.js` and `index.d.ts` for your application to use.

index.jsindex.d.tsposts.jsonothers.json

js

```
export { default as posts } from './posts.json'
export { default as others } from './others.json'
```

js

```
import type __vc from '../velite.config.js'

type Collections = typeof __vc.collections

export type Post = Collections['posts']['schema']['_output']
export declare const posts: Post[]

export type Other = Collections['others']['schema']['_output']
export declare const others: Other[]
```

json

```
[\
  {\
    "title": "Hello world",\
    "slug": "hello-world",\
    "date": "1992-02-25T13:22:00.000Z",\
    "cover": {\
      "src": "/static/cover-2a4138dh.jpg",\
      "height": 1100,\
      "width": 1650,\
      "blurDataURL": "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoIAAUADMDOJbACdADWaUXAAMltC0BZxTv24bHUX8EibgVs/sPiTqq6QAA=",\
      "blurWidth": 8,\
      "blurHeight": 5\
    },\
    "video": "/static/video-72hhd9f.mp4",\
    "metadata": {\
      "readingTime": 1,\
      "wordCount": 1\
    },\
    "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse",\
    "content": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse</p>\n<p><img src=\"/static/img-2hd8f3sd.jpg\" alt=\"some image\" /></p>\n<p><a href=\"/static/plain-37d62h1s.txt\">link to file</a></p>\n",\
    "permalink": "/blog/hello-world"\
  }\
]
```

json

```
[\
  ...\
]
```

TIP

If you're using Git for version control, we recommend ignoring the `.velite` directory by adding `.velite` to your `.gitignore`. This tells Git to ignore this directory and any files inside of it.

sh

```
echo '\n.velite' >> .gitignore
```

## Use in Your Project [​](https://velite.js.org/guide/using-collections\#use-in-your-project)

Here is a Next.js example of using the output in your project.

tsx

```
import { notFound } from 'next/navigation'

import { posts } from './.velite'

interface PostProps {
  params: {
    slug: string
  }
}

function getPostBySlug(slug: string) {
  return posts.find(post => post.slug === slug)
}

export default function PostPage({ params }: PostProps) {
  const post = getPostBySlug(params.slug)
  if (post == null) notFound()
  return (
    <article className="prose dark:prose-invert py-6">
      <h1 className="mb-2">{post.title}</h1>
      {post.description && <p className="mt-0 text-xl text-slate-700 dark:text-slate-200">{post.description}</p>}
      <hr className="my-4" />
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </article>
  )
}

export function generateMetadata({ params }: PostProps) {
  const post = getPostBySlug(params.slug)
  if (post == null) return {}
  return { title: post.title, description: post.description }
}

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }))
}
```

## Data Accessor [​](https://velite.js.org/guide/using-collections\#data-accessor)

Because each user's scenario is different, Velite is framework-agnostic and does not want to dictate the structure of the user's content or how to use the output it generates. Therefore, Velite does not have built-in APIs related to data access.

You can use the output data in your application as you like, such as using a function to get a single post by slug, or using a function to get a list of posts by category.

ts

```
import { authors, posts } from '../.velite'

import type { Author, Post } from '../.velite'

export const getPostBySlug = (slug: string) => {
  return posts.find(post => post.slug === slug)
}

export const getPostsByCategory = (category: string) => {
  return posts.filter(post => post.category === category)
}

export const getAuthors = async <F extends keyof Author>(
  filter: Filter<Author>,
  fields?: F[],
  limit: number = Infinity,
  offset: number = 0
): Promise<Pick<Author, F>[]> => {
  return authors
    .filter(filter)
    .sort((a, b) => (a.name > b.name ? -1 : 1))
    .slice(offset, offset + limit)
    .map(author => pick(author, fields))
}

export const getAuthorsCount = async (filter: Filter<Author> = filters.none): Promise<number> => {
  return authors.filter(filter).length
}

export const getAuthor = async <F extends keyof Author>(filter: Filter<Author>, fields?: F[]): Promise<Pick<Author, F> | undefined> => {
  const author = authors.find(filter)
  return author && pick(author, fields)
}

export const getAuthorByName = async <F extends keyof Author>(name: string, fields?: F[]): Promise<Pick<Author, F> | undefined> => {
  return getAuthor(i => i.name === name, fields)
}

export const getAuthorBySlug = async <F extends keyof Author>(slug: string, fields?: F[]): Promise<Pick<Author, F> | undefined> => {
  return getAuthor(i => i.slug === slug, fields)
}
```

In short, it is just raw JSON data that you can use in any way you want.

## Path Aliases [​](https://velite.js.org/guide/using-collections\#path-aliases)

You can define path aliases in `tsconfig.json`:

json

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#site/content": ["./.velite"]
    }
  }
}
```

then you can import the output file in your project:

tsx

```
import { posts } from '#site/content'

// ...
```

## Last Modified Schema
[Skip to content](https://velite.js.org/guide/last-modified#VPContent)

On this page

# Last Modified Schema [​](https://velite.js.org/guide/last-modified\#last-modified-schema)

You can create a custom schema to show the last modified time for your contents. This can be based on:

- File stat

- Git timestamp


## Based on file stat [​](https://velite.js.org/guide/last-modified\#based-on-file-stat)

Create a timestamp schema based on file stat.

ts

```
import { stat } from 'fs/promises'
import { defineSchema } from 'velite'

const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>(i => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the file modified timestamp' })
      }

      const stats = await stat(meta.path)
      return stats.mtime.toISOString()
    })
)
```

Use it in your schema

ts

```
const posts = defineCollection({
  // ...
  schema: {
    // ...
    lastModified: timestamp()
  }
})
```

## Based on git timestamp [​](https://velite.js.org/guide/last-modified\#based-on-git-timestamp)

ts

```
import { exec } from 'child_process'
import { promisify } from 'util'
import { defineSchema } from 'velite'

const execAsync = promisify(exec)

const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>(i => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`' })
      }
      const { stdout } = await execAsync(`git log -1 --format=%cd ${meta.path}`)
      return new Date(stdout || Date.now()).toISOString()
    })
)
```

Use it in your schema

ts

```
const posts = defineCollection({
  // ...
  schema: {
    // ...
    lastModified: timestamp()
  }
})
```

## Custom Schema Guide
[Skip to content](https://velite.js.org/guide/custom-schema#VPContent)

On this page

# Custom Schema [​](https://velite.js.org/guide/custom-schema\#custom-schema)

> Schema is the core of Velite. It defines the structure and type of your content and validates it.
>
> Refer to [Velite Schemas](https://velite.js.org/guide/velite-schemas) for more information about built-in schema.

Velite supports custom schema. A schema is a JavaScript function that returns a [Zod](https://zod.dev/) schema object.

Generally, I divide the schema into two categories: one for data validation and the other for data transformation.

## Define a Validation Schema [​](https://velite.js.org/guide/custom-schema\#define-a-validation-schema)

ts

```
import { defineSchema, s } from 'velite'

// `s` is extended from Zod with some custom schemas,
// `s` also includes all members of zod, so you can use `s` as `z`

// for validating title
export const title = defineSchema(() => s.string().min(1).max(100))

// for validating email
export const email = defineSchema(() => s.string().email({ message: 'Invalid email address' }))

// custom validation logic
export const hello = defineSchema(() =>
  s.string().refine(value => {
    if (value !== 'hello') {
      return 'Value must be "hello"'
    }
    return true
  })
)
```

Refer to [Zod documentation](https://zod.dev/) for more information about Zod.

## Define a Transformation Schema [​](https://velite.js.org/guide/custom-schema\#define-a-transformation-schema)

ts

```
import { defineSchema, s } from 'velite'

// for transforming title
export const title = defineSchema(() => s.string().transform(value => value.toUpperCase()))

// ...
```

### Example [​](https://velite.js.org/guide/custom-schema\#example)

#### Remote Image with BlurDataURL Schema [​](https://velite.js.org/guide/custom-schema\#remote-image-with-blurdataurl-schema)

ts

```
import { getImageMetadata, s } from 'velite'

import type { Image } from 'velite'

/**
 * Remote Image with metadata schema
 */
export const remoteImage = () =>
  s.string().transform<Image>(async (value, { addIssue }) => {
    try {
      const response = await fetch(value)
      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const metadata = await getImageMetadata(Buffer.from(buffer))
      if (metadata == null) throw new Error(`Failed to get image metadata: ${value}`)
      return { src: value, ...metadata }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      addIssue({ fatal: true, code: 'custom', message })
      return null as never
    }
  })
```

## Schema Context [​](https://velite.js.org/guide/custom-schema\#schema-context)

TIP

Considering that Velite's scenario often needs to obtain metadata information about the current file in the schema, Velite does not use the original Zod package. Instead, it uses a custom Zod package that provides a `meta` member in the schema context.

ts

```
import { defineSchema, s } from 'velite'

// convert a nonexistent field
export const path = defineSchema(() =>
  s.custom<string>().transform((value, ctx) => {
    if (ctx.meta.path) {
      return ctx.meta.path
    }
    return value
  })
)
```

### Reference [​](https://velite.js.org/guide/custom-schema\#reference)

the type of `meta` is `ZodMeta`, which extends [`VeliteFile`](https://velite.js.org/reference/types#velitefile).

## Asset Handling Guide
[Skip to content](https://velite.js.org/guide/asset-handling#VPContent)

On this page

# Asset Handling [​](https://velite.js.org/guide/asset-handling\#asset-handling)

TIP

This documentation is still being written. Please check back later.

## Refer [​](https://velite.js.org/guide/asset-handling\#refer)

- [File Schema](https://velite.js.org/guide/velite-schemas#s-file)
- [Image Schema](https://velite.js.org/guide/velite-schemas#s-image)
- [Markdown Schema](https://velite.js.org/guide/velite-schemas#s-markdown)
- [MDX Schema](https://velite.js.org/guide/velite-schemas#s-mdx)

## Uploading Assets [​](https://velite.js.org/guide/asset-handling\#uploading-assets)

You can upload assets to your OSS, CDN, or other storage services.

e.g. Upload images on complete hook:

ts

```
import { defineConfig } from 'velite'

export default defineConfig({
  output: {
    base: 'https://oss.your.com/static/'
  },
  complete: async () => {
    // TODO: upload images
    // static => https://oss.your.com/static/
  }
})
```

Currently, we don't provide any built-in uploading plugins, we will provide them in the future.

## Markdown Guide
[Skip to content](https://velite.js.org/guide/using-markdown#VPContent)

Return to top

# Markdown [​](https://velite.js.org/guide/using-markdown\#markdown)

TIP

This documentation is still being written. Please check back later.

Markdown is a lightweight markup language with plain text formatting syntax. It is designed so that it can be converted to HTML and many other formats using a tool by the same name. Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

Markdown or MDX

Markdown has top-level support in Velite. Although we also support MDX, I think that MDX is not the best choice for content creators. Although it is powerful and has stronger programmability, it is easy to lose the essence of writing and recording, and become addicted to technology.

- **Portable**: Markdown is portable, you can use it anywhere, even in the terminal.
- **Simple**: Markdown is simple, you can learn it in 10 minutes, don't need to spend a lot of time to learn React.
- **Easy to use**: Markdown is easy to use, you can use it to write documents, write blogs, and even write books.
- **Stronger by extension**: Markdown is extensible, you can use it to write code, write math formulas, and even write music.

## Custom Loaders in Velite
[Skip to content](https://velite.js.org/guide/custom-loader#VPContent)

Return to top

# Custom Loader [​](https://velite.js.org/guide/custom-loader\#custom-loader)

Built-in loaders are:

- `matter-loader`: parse frontmatter and provide content and data
- `json-loader`: parse document as json
- `yaml-loader`: parse document as yaml

Velite supports custom loaders. A loader is a function that takes a [vfile](https://github.com/vfile/vfile) as input and returns a JavaScript object.

In `velite.config.js`:

js

```
import toml from 'toml'
import { defineConfig, defineLoader } from 'velite'

const tomlLoader = defineLoader({
  test: /\.toml$/,
  load: vfile => {
    return { data: toml.parse(vfile.toString()) }
  }
})

export default defineConfig({
  // ...
  loaders: [tomlLoader]
})
```

TIP

This documentation is still being written. Please check back later.

## Understanding Velite
[Skip to content](https://velite.js.org/guide/how-it-works#VPContent)

Return to top

# How Velite Works [​](https://velite.js.org/guide/how-it-works\#how-velite-works)

![Velite Workflow](https://velite.js.org/assets/flow-dark.svg#dark)![Velite Workflow](https://velite.js.org/assets/flow.svg#light)

TIP

This documentation is still being written. Please check back later.

