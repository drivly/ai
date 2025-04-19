/**
 * EXAMPLE COLLECTIONS FOR BETTER AUTH
 *
 * Below is what your Payload collections should look like.
 * Please copy these to your actual collection configs.
 * Make sure to add an authStrategy for the users collection if there is one.
 *
 * Example auth strategy:
 * auth: {
 *   disableLocalStrategy: true,
 *   strategies: [
 *     betterAuthStrategy(),
 *     // Add other strategies as needed
 *   ],
 * },
 */
import type { CollectionConfig } from 'payload';
declare const User: CollectionConfig;
declare const Session: CollectionConfig;
declare const Account: CollectionConfig;
declare const Verification: CollectionConfig;
declare const Admin: CollectionConfig;
export { User, Session, Account, Verification, Admin };
//# sourceMappingURL=schema.d.ts.map