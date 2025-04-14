# Next.js Template for Vercel

This is a standard Next.js template configured for deployment on Vercel. It includes TypeScript, ESLint, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm (recommended), npm, yarn, or bun

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font from Vercel.

## Building for Production

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

## Deploying to Vercel

### Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run the deployment command from your project directory:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project to a Vercel account and configure your deployment.

### Deploy with Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import your project into Vercel using the [Vercel for Git](https://vercel.com/docs/git) integration.
3. Vercel will automatically deploy your application and provide you with a URL.

### Environment Variables

For production deployments, make sure to configure any required environment variables in the Vercel dashboard or using the Vercel CLI.

## Learn More

To learn more about Next.js and Vercel, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
