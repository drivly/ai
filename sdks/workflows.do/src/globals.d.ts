/**
 * Global types for Cloudflare Worker Durable Objects environment
 */
declare global {
  var DURABLE_OBJECT:
    | {
        storage: any
      }
    | undefined
}

export {}
