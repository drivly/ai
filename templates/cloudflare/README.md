# Next.js Template for Cloudflare Pages

This is a Next.js template configured with OpenNext for deployment on Cloudflare Pages. It includes TypeScript, ESLint, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm (recommended), npm, yarn, or bun
- Cloudflare account with Pages access

### Installing Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn

# Using bun
bun install
```

### Local Development

Run the development server:

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Building for Production

The build process uses OpenNext to optimize your Next.js application for Cloudflare:

```bash
# Using pnpm
pnpm build

# Using npm
npm run build

# Using yarn
yarn build

# Using bun
bun run build
```

This will generate the `.open-next` directory with the optimized build.

## Local Preview

You can preview the production build locally using Wrangler:

```bash
# Using pnpm
pnpm preview

# Using npm
npm run preview

# Using yarn
yarn preview

# Using bun
bun run preview
```

## Deploying to Cloudflare Pages

### Deploy with Wrangler CLI

1. Make sure you're logged in to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy your application:
   ```bash
   pnpm deploy
   ```

3. Follow the prompts to complete the deployment.

### Deploy with Cloudflare Pages Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. In the Cloudflare Dashboard, go to Pages and create a new project.
3. Connect your repository and configure the build settings:
   - Build command: `pnpm build`
   - Build output directory: `.open-next/standalone`
   - Environment variables: Add any required environment variables

4. Deploy your project.

### Environment Variables

For production deployments, configure environment variables in the Cloudflare Dashboard or using Wrangler:

```bash
npx wrangler secret put MY_SECRET_NAME
```

## Configuration

The template includes a `wrangler.jsonc` file with the basic configuration for Cloudflare deployment. You may need to update this file with your specific domain and KV namespace settings.

## Learn More

To learn more about Next.js, OpenNext, and Cloudflare Pages, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext Documentation](https://opennext.js.org/)
- [OpenNext Cloudflare Guide](https://opennext.js.org/cloudflare)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
