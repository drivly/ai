import { generateId } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { setCookieCache } from 'better-auth/cookies';
import { parseSetCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { getPayloadAuth } from '../../../lib/get-payload-auth';
import { getIp } from '../../../helpers/get-ip';
import { prepareSessionData } from '../../../lib/prepare-session-data';
/**
 * This hook is used to sync the admin login token with better-auth session token
 * It also creates a new session in better-auth
 */ export const getAfterLoginHook = (options)=>{
    const hook = async ({ collection, context, req, token, user })=>{
        const config = req.payload.config;
        const payload = await getPayloadAuth(config);
        const cookieStore = await cookies();
        const authContext = await payload.betterAuth.$context;
        const sessionExpiration = payload.betterAuth.options.session?.expiresIn || 60 * 60 * 24 * 7 // 7 days
        ;
        // we can't use internal adapter as we can cause a race condition unless we pass req to the payload.create
        const session = await payload.create({
            collection: options.sessionsCollectionSlug,
            data: {
                ipAddress: getIp(req.headers, payload.betterAuth.options) || '',
                userAgent: req.headers?.get('user-agent') || '',
                user: user.id,
                token: generateId(32),
                expiresAt: new Date(Date.now() + sessionExpiration * 1000)
            },
            req
        });
        const betterAuthHandleRequest = createAuthMiddleware(async (ctx)=>{
            ctx.context = {
                ...authContext,
                user: user
            };
            await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.token, ctx.context.secret, ctx.context.authCookies.sessionToken.options);
            const filteredSessionData = await prepareSessionData({
                newSession: {
                    session,
                    user
                },
                payloadConfig: config,
                collectionSlugs: {
                    userCollectionSlug: options.usersCollectionSlug,
                    sessionCollectionSlug: options.sessionsCollectionSlug
                }
            });
            await setCookieCache(ctx, filteredSessionData);
            if ('responseHeaders' in ctx) {
                return ctx.responseHeaders;
            }
            return null;
        });
        const responseHeaders = await betterAuthHandleRequest(req);
        const responseCookies = responseHeaders?.getSetCookie().map((cookie)=>parseSetCookie(cookie)).filter(Boolean);
        if (responseCookies) {
            for (const cookieData of responseCookies){
                const { name, value, ...options } = cookieData;
                cookieStore.set({
                    ...options,
                    name,
                    value: decodeURIComponent(value)
                });
            }
        }
    };
    return hook;
};

//# sourceMappingURL=after-login.js.map