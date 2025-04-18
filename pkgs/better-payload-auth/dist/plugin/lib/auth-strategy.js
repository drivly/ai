import { getPayloadAuth } from './get-payload-auth';
/**
 * Auth strategy for BetterAuth
 * @param adminRoles - Admin roles
 * @param userSlug - User collection slug
 * @returns Auth strategy
 */ export function betterAuthStrategy(adminRoles, userSlug) {
    return {
        name: 'better-auth',
        authenticate: async ({ payload, headers })=>{
            const payloadAuth = await getPayloadAuth(payload.config);
            const session = await payloadAuth.betterAuth.api.getSession({
                headers
            });
            const sessionUserIdField = payloadAuth.betterAuth.options.session?.fields?.userId ?? 'userId';
            const userId = session?.session?.[sessionUserIdField] ?? session?.user?.id;
            if (!session || !userId) {
                return {
                    user: null
                };
            }
            try {
                const user = await payloadAuth.findByID({
                    collection: userSlug ?? 'users',
                    id: userId
                });
                if (!user) {
                    return {
                        user: null
                    };
                }
                return {
                    user: {
                        ...user,
                        collection: userSlug ?? 'users',
                        _strategy: 'better-auth'
                    }
                };
            } catch  {
                return {
                    user: null
                };
            }
        }
    };
}

//# sourceMappingURL=auth-strategy.js.map