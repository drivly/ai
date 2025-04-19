import { subtle } from 'uncrypto';
export const verifySignature = async (base64Signature, value, secret)=>{
    try {
        const signatureBinStr = atob(base64Signature);
        const signature = new Uint8Array(signatureBinStr.length);
        for(let i = 0, len = signatureBinStr.length; i < len; i++){
            signature[i] = signatureBinStr.charCodeAt(i);
        }
        return await subtle.verify(algorithm, secret, signature, new TextEncoder().encode(value));
    } catch (e) {
        return false;
    }
};
const _serialize = (key, value, opt = {})=>{
    let cookie;
    if (opt?.prefix === 'secure') {
        cookie = `${`__Secure-${key}`}=${value}`;
    } else if (opt?.prefix === 'host') {
        cookie = `${`__Host-${key}`}=${value}`;
    } else {
        cookie = `${key}=${value}`;
    }
    if (key.startsWith('__Secure-') && !opt.secure) {
        opt.secure = true;
    }
    if (key.startsWith('__Host-')) {
        if (!opt.secure) {
            opt.secure = true;
        }
        if (opt.path !== '/') {
            opt.path = '/';
        }
        if (opt.domain) {
            opt.domain = undefined;
        }
    }
    if (opt && typeof opt.maxAge === 'number' && opt.maxAge >= 0) {
        if (opt.maxAge > 34560000) {
            throw new Error('Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.');
        }
        cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
    }
    if (opt.domain && opt.prefix !== 'host') {
        cookie += `; Domain=${opt.domain}`;
    }
    if (opt.path) {
        cookie += `; Path=${opt.path}`;
    }
    if (opt.expires) {
        if (opt.expires.getTime() - Date.now() > 34560000_000) {
            throw new Error('Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.');
        }
        cookie += `; Expires=${opt.expires.toUTCString()}`;
    }
    if (opt.httpOnly) {
        cookie += '; HttpOnly';
    }
    if (opt.secure) {
        cookie += '; Secure';
    }
    if (opt.sameSite) {
        cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
    }
    if (opt.partitioned) {
        if (!opt.secure) {
            opt.secure = true;
        }
        cookie += '; Partitioned';
    }
    return cookie;
};
const algorithm = {
    name: 'HMAC',
    hash: 'SHA-256'
};
const getCryptoKey = async (secret)=>{
    const secretBuf = typeof secret === 'string' ? new TextEncoder().encode(secret) : secret;
    return await subtle.importKey('raw', secretBuf, algorithm, false, [
        'sign',
        'verify'
    ]);
};
const makeSignature = async (value, secret)=>{
    const key = await getCryptoKey(secret);
    const signature = await subtle.sign(algorithm.name, key, new TextEncoder().encode(value));
    // the returned base64 encoded signature will always be 44 characters long and end with one or two equal signs
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
export const signCookieValue = async (value, secret)=>{
    const signature = await makeSignature(value, secret);
    value = `${value}.${signature}`;
    value = encodeURIComponent(value);
    value = decodeURIComponent(value);
    return value;
};
export const serializeCookie = (key, value, opt)=>{
    value = encodeURIComponent(value);
    return _serialize(key, value, opt);
};
export const serializeSignedCookie = async (key, value, secret, opt)=>{
    value = await signCookieValue(value, secret);
    return _serialize(key, value, opt);
};
export const getCookieKey = (key, prefix)=>{
    let finalKey = key;
    if (prefix) {
        if (prefix === 'secure') {
            finalKey = '__Secure-' + key;
        } else if (prefix === 'host') {
            finalKey = '__Host-' + key;
        } else {
            return undefined;
        }
    }
    return finalKey;
};
export function tryDecode(str) {
    try {
        return str.includes('%') ? decodeURIComponent(str) : str;
    } catch  {
        return str;
    }
}
/**
 * Parse an HTTP Cookie header string and returning an object of all cookie
 * name-value pairs.
 *
 * Inspired by https://github.com/unjs/cookie-es/blob/main/src/cookie/parse.ts
 *
 * @param str the string representing a `Cookie` header value
 */ export function parseCookies(str) {
    if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
    }
    const cookies = new Map();
    let index = 0;
    while(index < str.length){
        const eqIdx = str.indexOf('=', index);
        if (eqIdx === -1) {
            break;
        }
        let endIdx = str.indexOf(';', index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }
        const key = str.slice(index, eqIdx).trim();
        if (!cookies.has(key)) {
            let val = str.slice(eqIdx + 1, endIdx).trim();
            if (val.codePointAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            cookies.set(key, tryDecode(val));
        }
        index = endIdx + 1;
    }
    return cookies;
}
export const getSignedCookie = async (key, secret, headers, prefix)=>{
    const finalKey = getCookieKey(key, prefix);
    if (!finalKey) {
        return null;
    }
    const cookieHeader = headers.get('cookie');
    const parsedCookies = cookieHeader ? parseCookies(cookieHeader) : undefined;
    const value = parsedCookies?.get(finalKey);
    if (!value) {
        return null;
    }
    const signatureStartPos = value.lastIndexOf('.');
    if (signatureStartPos < 1) {
        return null;
    }
    const signedValue = value.substring(0, signatureStartPos);
    const signature = value.substring(signatureStartPos + 1);
    if (signature.length !== 44 || !signature.endsWith('=')) {
        return null;
    }
    const secretKey = await getCryptoKey(secret);
    const isVerified = await verifySignature(signature, signedValue, secretKey);
    return isVerified ? signedValue : false;
};

//# sourceMappingURL=serialize-cookie.js.map