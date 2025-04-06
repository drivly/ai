export default {
  ignores: ['dist/**', 'node_modules/**'],
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: {
      moduleType: 'esm',
    },
  },
}
