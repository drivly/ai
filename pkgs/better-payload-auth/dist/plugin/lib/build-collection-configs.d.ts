import type { PayloadBetterAuthPluginOptions, SanitizedBetterAuthOptions } from '..';
import { CollectionConfig } from 'payload';
/**
 * Builds the required collections based on the BetterAuth options and plugins
 */
export declare function buildCollectionConfigs({ incomingCollections, requiredCollectionSlugs, pluginOptions, sanitizedBAOptions, }: {
    incomingCollections: CollectionConfig[];
    requiredCollectionSlugs: Set<string>;
    pluginOptions: PayloadBetterAuthPluginOptions;
    sanitizedBAOptions: SanitizedBetterAuthOptions;
}): CollectionConfig[];
//# sourceMappingURL=build-collection-configs.d.ts.map