# eslint-config

Shared ESLint configurations for the drivly/ai monorepo.

## Usage

### Basic Configuration

```js
// eslint.config.js
import baseConfig from 'eslint-config'

export default baseConfig
```

### TypeScript Configuration

```js
// eslint.config.js
import tsConfig from 'eslint-config/typescript'

export default tsConfig
```

### Next.js Configuration

```js
// eslint.config.js
import nextConfig from 'eslint-config/next'

export default nextConfig
```

### Extending Configurations

```js
// eslint.config.js
import tsConfig from 'eslint-config/typescript'

export default [
  ...tsConfig,
  {
    // Add your custom rules here
    rules: {
      // Your custom rules
    },
  },
]
```
