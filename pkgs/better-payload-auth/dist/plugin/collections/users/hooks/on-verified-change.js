export const onVerifiedChange = async ({ data, originalDoc })=>{
    const isVerifiedChangingToTrue = Boolean(data._verified) && !originalDoc?._verified;
    const isEmailVerifiedChangingToTrue = Boolean(data.emailVerified) && !originalDoc?.emailVerified;
    if (!isVerifiedChangingToTrue && !isEmailVerifiedChangingToTrue) {
        return data;
    }
    return {
        ...data,
        _verified: true,
        emailVerified: true
    };
};

//# sourceMappingURL=on-verified-change.js.map