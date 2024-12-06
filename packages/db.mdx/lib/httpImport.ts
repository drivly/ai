import { Plugin, PluginBuild, OnResolveArgs, OnLoadArgs } from 'esbuild'

export const httpImport: Plugin = {
  name: 'http',
  setup(build: PluginBuild) {
    // Intercept import paths starting with "http:" and "https:" so
    // esbuild doesn't attempt to map them to a file system location.
    // Tag them with the "http-url" namespace to associate them with
    // this plugin.
    build.onResolve({ filter: /^https?:\/\// }, (args: OnResolveArgs) => ({
      path: args.path,
      namespace: 'http-url',
    }))

    // Intercept import paths inside downloaded files and resolve them
    // against the original URL. All of these files will be in the
    // "http-url" namespace, ensuring recursive URL resolution.
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args: OnResolveArgs) => ({
      path: new URL(args.path, args.importer).toString(),
      namespace: 'http-url',
    }))

    // When a URL is loaded, fetch the content from the internet.
    // Using fetch simplifies handling and redirections.
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args: OnLoadArgs) => {
      console.log(`Downloading: ${args.path}`)
      const res = await fetch(args.path)
      if (!res.ok) {
        throw new Error(`GET ${args.path} failed: status ${res.status}`)
      }
      const arrayBuffer = await res.arrayBuffer()
      const contents = Buffer.from(arrayBuffer)
      return { contents }
    })
  },
}
