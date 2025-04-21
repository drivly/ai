export const getSyncPasswordToUserHook = (options)=>{
    const hook = async ({ doc, req, operation, context })=>{
        if (context?.syncAccountHook) return doc;
        if (operation !== 'create' && operation !== 'update') {
            return doc;
        }
        const userField = req.payload.betterAuth.options.account?.fields?.userId || 'userId';
        if (!doc[userField]) {
            return doc;
        }
        const account = await req.payload.findByID({
            collection: options.accountSlug,
            id: doc.id,
            depth: 0,
            req,
            showHiddenFields: true
        });
        if (!account || !account.password) {
            return doc;
        }
        const [salt, hash] = account.password.split(':');
        if (!salt || !hash) {
            return doc;
        }
        const userId = typeof doc[userField] === 'string' ? doc[userField] : doc[userField]?.id;
        try {
            await req.payload.update({
                collection: options.userSlug,
                id: userId,
                data: {
                    salt,
                    hash
                },
                req,
                context: {
                    syncPasswordToUser: true
                }
            });
        } catch (error) {
            console.error('Failed to sync password to user:', error);
        }
        return doc;
    };
    return hook;
};

//# sourceMappingURL=sync-password-to-user.js.map