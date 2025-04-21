'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createAuthClient } from 'better-auth/react';
export default function LoginRedirect() {
    const authClient = createAuthClient({});
    authClient.signIn.social({
        provider: 'github',
        callbackURL: '/admin'
    });
    return /*#__PURE__*/ _jsx("div", {
        className: "hidden",
        children: "Redirecting to GitHub..."
    });
}

//# sourceMappingURL=login-redirect.js.map