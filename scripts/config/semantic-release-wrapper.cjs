/**
 * CommonJS wrapper for ESM semantic-release config
 */
module.exports = {
  branches: [
    'main',
    {name: 'next', prerelease: 'next', channel: 'next'}
  ],
  ignorePrivatePackages: true,
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        {type: 'feat', release: 'patch'},
        {type: 'fix', release: 'patch'},
        {type: 'docs', release: 'patch'},
        {type: 'style', release: 'patch'},
        {type: 'refactor', release: 'patch'},
        {type: 'perf', release: 'patch'},
        {type: 'test', release: 'patch'},
        {type: 'build', release: 'patch'},
        {type: 'ci', release: 'patch'},
        {type: 'chore', release: 'patch'}
      ]
    }],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }]
  ]
};
