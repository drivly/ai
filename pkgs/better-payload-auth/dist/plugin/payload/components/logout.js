'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';
import { createAuthClient } from 'better-auth/react';
export default function LogoutButton() {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const handleLogout = async ()=>{
        setLoading(true);
        try {
            await createAuthClient().signOut({
                fetchOptions: {
                    onResponse: ()=>{
                        setLoading(false);
                    },
                    onError: ()=>{
                        setLoading(false);
                    },
                    onSuccess: ()=>{
                        router.refresh();
                    }
                }
            });
        } catch (error) {
            setLoading(false);
        }
    };
    return /*#__PURE__*/ _jsx("button", {
        onClick: handleLogout,
        disabled: loading,
        style: {
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
        },
        onMouseOver: (e)=>e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)',
        onMouseOut: (e)=>e.currentTarget.style.backgroundColor = 'transparent',
        children: loading ? /*#__PURE__*/ _jsx(Loader2, {
            style: {
                height: '32px',
                width: '32px',
                animation: 'spin 1s linear infinite'
            }
        }) : /*#__PURE__*/ _jsx(LogOut, {
            style: {
                height: '32px',
                width: '32px'
            }
        })
    });
}

//# sourceMappingURL=logout.js.map