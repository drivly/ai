import nextConfig from 'eslint-config-next'
import tsConfig from './typescript.js'

export default [
  ...tsConfig,
  ...nextConfig,
]
