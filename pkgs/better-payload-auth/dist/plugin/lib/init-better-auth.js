import { betterAuth } from 'better-auth';
import { payloadAdapter } from '../../adapter';
export function initBetterAuth({ payload, options }) {
    const auth = betterAuth({
        ...options,
        database: payloadAdapter(payload, {
            enableDebugLogs: options.enableDebugLogs ?? false
        })
    });
    return auth;
}

//# sourceMappingURL=init-better-auth.js.map