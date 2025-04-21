import type { Config } from 'payload';
import type { PayloadBetterAuthPluginOptions } from './types';
export * from './types';
export * from './helpers';
export { sanitizeBetterAuthOptions } from './lib/sanitize-auth-options';
export { getPayloadAuth } from './lib/get-payload-auth';
export declare function betterAuthPlugin(pluginOptions: PayloadBetterAuthPluginOptions): (config: Config) => Config;
//# sourceMappingURL=index.d.ts.map