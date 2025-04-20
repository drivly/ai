import { getPayload } from 'payload';
export async function getPayloadAuth(config) {
    const payload = await getPayload({
        config
    });
    return payload;
}

//# sourceMappingURL=get-payload-auth.js.map