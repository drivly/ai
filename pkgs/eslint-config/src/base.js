import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off', // Disabled as requested
      '@typescript-eslint/no-unused-vars': 'off', // Disabled as requested
      'no-console': 'warn',
      'prefer-const': 'warn',
      'no-undef': 'error',
      'report-unused-disable-directives': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          semi: false,
          singleQuote: true,
          jsxSingleQuote: true,
          lineWidth: 160,
          tabWidth: 2,
        },
      ],
    },
  },
  prettier,
]
