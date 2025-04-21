import type { PayloadBetterAuthPluginOptions, SanitizedBetterAuthOptions } from '..';
/**
 * Determines which collections are required based on the BetterAuth options and plugins
 */
export declare function getRequiredCollectionSlugs({ logTables, pluginOptions, sanitizedBAOptions, }: {
    logTables: boolean;
    pluginOptions: PayloadBetterAuthPluginOptions;
    sanitizedBAOptions: SanitizedBetterAuthOptions;
}): Set<string>;
//# sourceMappingURL=get-required-collection-slugs.d.ts.map