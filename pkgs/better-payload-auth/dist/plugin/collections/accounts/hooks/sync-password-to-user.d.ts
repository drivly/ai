import type { CollectionAfterChangeHook } from 'payload';
type SyncPasswordToUserOptions = {
    userSlug: string;
    accountSlug: string;
};
export declare const getSyncPasswordToUserHook: (options: SyncPasswordToUserOptions) => CollectionAfterChangeHook;
export {};
//# sourceMappingURL=sync-password-to-user.d.ts.map