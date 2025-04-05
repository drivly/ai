import tsConfig from './typescript.js'

export default [
  ...tsConfig,
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off'
    }
  }
]
