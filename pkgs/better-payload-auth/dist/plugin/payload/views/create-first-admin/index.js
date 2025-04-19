import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent';
import { redirect } from 'next/navigation';
import { Gutter } from '@payloadcms/ui';
import { SignUp } from '../../components/sign-up';
import Logo from '../../components/logo';
export default async function CreateFirstAdmin({ initPageResult, params, searchParams, defaultAdminRole }) {
    const { locale, permissions, req } = initPageResult;
    const { i18n, payload: { config }, payload, user } = req;
    const { admin: { components: { afterLogin, beforeLogin, graphics } = {}, user: userSlug }, routes: { admin, api } } = config;
    const adminCount = await req.payload.count({
        collection: userSlug,
        where: {
            role: {
                equals: defaultAdminRole ?? 'admin'
            }
        }
    });
    if (adminCount.totalDocs > 0) {
        redirect(admin);
    }
    // const addRoleAction = async (userId: string) => {
    //   'use server'
    //   await payload.update({
    //     collection: userSlug,
    //     id: userId,
    //     data: {
    //       role: defaultAdminRole ?? 'admin',
    //     },
    //   })
    // }
    // Filter out the first component from afterLogin array or set to undefined if not more than 1
    const filteredAfterLogin = Array.isArray(afterLogin) && afterLogin.length > 1 ? afterLogin.slice(1) : undefined;
    return /*#__PURE__*/ _jsx(Gutter, {
        className: "mt-40",
        children: /*#__PURE__*/ _jsxs("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            },
            children: [
                /*#__PURE__*/ _jsx("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '1.5rem'
                    },
                    children: RenderServerComponent({
                        Component: graphics?.Logo,
                        Fallback: ()=>/*#__PURE__*/ _jsx(Logo, {}),
                        importMap: payload.importMap,
                        serverProps: {
                            i18n,
                            locale,
                            params,
                            payload,
                            permissions,
                            searchParams,
                            user: user ?? undefined
                        }
                    })
                }),
                RenderServerComponent({
                    Component: beforeLogin,
                    importMap: payload.importMap,
                    serverProps: {
                        i18n,
                        locale,
                        params,
                        payload,
                        permissions,
                        searchParams,
                        user: user ?? undefined
                    }
                }),
                /*#__PURE__*/ _jsx("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    },
                    children: /*#__PURE__*/ _jsx(SignUp, {
                        admin: true,
                        apiRoute: api,
                        userSlug: userSlug,
                        defaultAdminRole: defaultAdminRole
                    })
                }),
                RenderServerComponent({
                    Component: filteredAfterLogin,
                    importMap: payload.importMap,
                    serverProps: {
                        i18n,
                        locale,
                        params,
                        payload,
                        permissions,
                        searchParams,
                        user: user ?? undefined
                    }
                })
            ]
        })
    });
}

//# sourceMappingURL=index.js.map