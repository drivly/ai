import type { SanitizedBetterAuthOptions, PayloadBetterAuthPluginOptions } from '..';
import type { Config, Payload } from 'payload';
/**
 * Sets up a middleware that enforces the saveToJwt configuration when setting session data.
 * This ensures that only fields specified in saveToJwt are included in the cookie cache
 * for both user and session objects.
 *
 * The middleware runs after authentication and filters the session data based on
 * the collection configurations before storing it in the cookie cache.
 */
export declare function respectSaveToJwtFieldsMiddleware({ sanitizedOptions, payloadConfig, pluginOptions, }: {
    sanitizedOptions: SanitizedBetterAuthOptions;
    payloadConfig: Payload['config'] | Config;
    pluginOptions: PayloadBetterAuthPluginOptions;
}): void;
//# sourceMappingURL=respect-save-to-jwt-fields-middleware.d.ts.map