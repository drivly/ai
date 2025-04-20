import type { CollectionAfterLogoutHook } from 'payload';
type AfterLogoutOptions = {
    sessionsCollectionSlug: string;
};
export declare const getAfterLogoutHook: (options: AfterLogoutOptions) => CollectionAfterLogoutHook;
export {};
//# sourceMappingURL=after-logout.d.ts.map