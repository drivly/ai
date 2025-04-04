import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'workers',
    poolOptions: {
      workers: {
        factory: '@cloudflare/vitest-pool-workers/factory',
        options: {
          wrangler: {
            configPath: './wrangler.toml',
          },
        },
      },
    },
  },
});
