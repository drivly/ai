import type { Config, Payload } from 'payload';
type CollectionSlugs = {
    userCollectionSlug: string;
    sessionCollectionSlug: string;
};
/**
 * Prepares session data for cookie cache by filtering user and session objects
 * based on the payload configuration's 'saveToJwt' property
 */
export declare function prepareSessionData({ newSession, payloadConfig, collectionSlugs, }: {
    newSession: {
        user: any;
        session: any;
    };
    payloadConfig: Payload['config'] | Config;
    collectionSlugs: CollectionSlugs;
}): Promise<{
    user: Record<string, unknown>;
    session: any;
}>;
export {};
//# sourceMappingURL=prepare-session-data.d.ts.map