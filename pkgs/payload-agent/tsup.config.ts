import path from 'path'
import { defineConfig } from 'tsup'
import react18Plugin from 'esbuild-plugin-react18'
import cssModulePlugin from 'esbuild-plugin-css-module'

export default defineConfig({
  target: 'es2022',
  entry: {
    plugin: 'src/plugin.ts',
    api: 'src/api.ts',
    'chat-bot-server': 'src/chat-bot-server.ts',
    'chat-bot-client': 'src/chat-bot-client.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  bundle: true,
  dts: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'payload',
    'next',
    'next/server',
    'next/headers',
    'use-sync-external-store',
    'use-sync-external-store/shim',
    'swr',
    'zustand',
  ],
  esbuildOptions(options) {
    options.alias = {
      'node:path': 'path',
      'node:fs': 'fs',
      'node:url': 'url',
      'node:process': 'process',
    }
    return options
  },
  plugins: [react18Plugin(), cssModulePlugin()],
})
