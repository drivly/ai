export default {
  ignores: ['dist/**', 'node_modules/**'],
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}
