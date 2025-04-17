import tsConfig from 'eslint-config/typescript'

export default [
  ...tsConfig, // Spread the existing config array
  {
    languageOptions: {
      globals: {
        'ReadableStream': 'readonly',
        'TextDecoderStream': 'readonly',
        'TextEncoder': 'readonly', // Added TextEncoder as it was used in the test mock
        'setTimeout': 'readonly',
        'Promise': 'readonly',
        'console': 'readonly', // Used in test mocks
      }
    },
  }
]
