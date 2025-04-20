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
 */ const User = {
    slug: 'user',
    admin: {
        useAsTitle: 'name'
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'email',
            type: 'email',
            required: true,
            unique: true
        },
        {
            name: 'emailVerified',
            type: 'checkbox',
            required: true
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media'
        }
    ],
    timestamps: true
};
const Session = {
    slug: 'session',
    admin: {
        useAsTitle: 'expiresAt'
    },
    fields: [
        {
            name: 'expiresAt',
            type: 'date',
            required: true
        },
        {
            name: 'token',
            type: 'text',
            required: true,
            unique: true
        },
        {
            name: 'ipAddress',
            type: 'text'
        },
        {
            name: 'userAgent',
            type: 'text'
        },
        {
            name: 'userId',
            type: 'relationship',
            required: true,
            relationTo: 'user'
        }
    ],
    timestamps: true
};
const Account = {
    slug: 'account',
    admin: {
        useAsTitle: 'accountId'
    },
    fields: [
        {
            name: 'accountId',
            type: 'text',
            required: true
        },
        {
            name: 'providerId',
            type: 'text',
            required: true
        },
        {
            name: 'userId',
            type: 'relationship',
            required: true,
            relationTo: 'user'
        },
        {
            name: 'accessToken',
            type: 'text'
        },
        {
            name: 'refreshToken',
            type: 'text'
        },
        {
            name: 'idToken',
            type: 'text'
        },
        {
            name: 'accessTokenExpiresAt',
            type: 'date'
        },
        {
            name: 'refreshTokenExpiresAt',
            type: 'date'
        },
        {
            name: 'scope',
            type: 'text'
        },
        {
            name: 'password',
            type: 'text'
        }
    ],
    timestamps: true
};
const Verification = {
    slug: 'verification',
    admin: {
        useAsTitle: 'identifier'
    },
    fields: [
        {
            name: 'identifier',
            type: 'text',
            required: true
        },
        {
            name: 'value',
            type: 'text',
            required: true
        },
        {
            name: 'expiresAt',
            type: 'date',
            required: true
        }
    ],
    timestamps: true
};
const Admin = {
    slug: 'admin',
    admin: {
        useAsTitle: 'name'
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'isAdmin',
            type: 'checkbox',
            required: true
        },
        {
            name: 'status',
            type: 'text'
        },
        {
            name: 'date',
            type: 'date'
        },
        {
            name: 'number',
            type: 'number'
        },
        {
            name: 'str_array',
            type: 'text'
        },
        {
            name: 'num_array',
            type: 'text'
        }
    ],
    timestamps: true
};
export { User, Session, Account, Verification, Admin };

//# sourceMappingURL=schema.js.map