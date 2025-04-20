import { CollectionAfterLoginHook } from 'payload';
type AfterLoginOptions = {
    usersCollectionSlug: string;
    sessionsCollectionSlug: string;
};
/**
 * This hook is used to sync the admin login token with better-auth session token
 * It also creates a new session in better-auth
 */
export declare const getAfterLoginHook: (options: AfterLoginOptions) => CollectionAfterLoginHook;
export {};
//# sourceMappingURL=after-login.d.ts.map