import tsConfig from './typescript.js'

export default [
  ...tsConfig,
  {
    files: ['**/*.worker.ts', '**/worker.ts', '**/workers/**/*.ts'],
    rules: {
      'no-restricted-globals': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
    languageOptions: {
      globals: {
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        ReadableStream: 'readonly',
        WritableStream: 'readonly',
        TransformStream: 'readonly',
        FetchEvent: 'readonly',
        addEventListener: 'readonly',
        crypto: 'readonly',
        caches: 'readonly',
        WebSocketPair: 'readonly',
      },
    },
  },
]
