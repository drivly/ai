import { getFieldsToSign } from 'payload';
/**
 * Prepares session data for cookie cache by filtering user and session objects
 * based on the payload configuration's 'saveToJwt' property
 */ export async function prepareSessionData({ newSession, payloadConfig, collectionSlugs }) {
    if (!newSession || !newSession.user) {
        return null;
    }
    const { userCollectionSlug, sessionCollectionSlug } = collectionSlugs;
    const userCollection = payloadConfig?.collections?.find((c)=>c.slug === userCollectionSlug);
    const sessionCollection = payloadConfig?.collections?.find((c)=>c.slug === sessionCollectionSlug);
    if (!userCollection) {
        throw new Error(`User collection with slug '${userCollectionSlug}' not found`);
    }
    const filteredUser = getFieldsToSign({
        collectionConfig: userCollection,
        email: newSession.user.email,
        user: newSession.user
    });
    let filteredSession = newSession.session;
    const isImpersonated = newSession.session.impersonatedBy;
    if (sessionCollection && newSession.session) {
        filteredSession = getFieldsToSign({
            collectionConfig: sessionCollection,
            email: newSession.user.email,
            user: newSession.session
        });
        // getFieldsToSign is meant for auth collections so we remove the email and collection fields
        delete filteredSession.email;
        delete filteredSession.collection;
    }
    if (isImpersonated) {
        filteredSession.impersonatedBy = newSession.session.impersonatedBy;
    }
    return {
        ...newSession,
        user: filteredUser,
        session: filteredSession
    };
}

//# sourceMappingURL=prepare-session-data.js.map