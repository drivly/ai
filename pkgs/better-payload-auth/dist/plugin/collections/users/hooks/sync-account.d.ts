import type { CollectionAfterChangeHook } from 'payload';
type SyncAccountOptions = {
    userSlug: string;
    accountSlug: string;
};
export declare const getSyncAccountHook: (options: SyncAccountOptions) => CollectionAfterChangeHook;
export {};
//# sourceMappingURL=sync-account.d.ts.map