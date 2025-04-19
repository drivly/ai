'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PasswordInput } from './ui/password-input';
export function SignUp({ admin = false, apiRoute, userSlug, defaultAdminRole }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();
    const authClient = createAuthClient({
        plugins: [
            inferAdditionalFields({
                user: {
                    role: {
                        type: 'string'
                    }
                }
            })
        ]
    });
    const handleImageChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const addAdminRole = async (userId)=>{
        try {
            const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${apiRoute}/${userSlug}/${userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: defaultAdminRole ?? 'admin'
                })
            });
        } catch (err) {
            console.log(err);
        }
    };
    const [loading, setLoading] = useState(false);
    return /*#__PURE__*/ _jsxs(Card, {
        className: "z-50 rounded-md rounded-t-none w-full max-w-md mx-auto shadow-lg",
        children: [
            /*#__PURE__*/ _jsxs(CardHeader, {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ _jsx(CardTitle, {
                        className: "text-xl md:text-2xl font-bold",
                        children: "Sign Up"
                    }),
                    /*#__PURE__*/ _jsx(CardDescription, {
                        className: "text-sm text-muted-foreground",
                        children: "Enter your information to create an account"
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(CardContent, {
                className: "space-y-4",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ _jsx(Label, {
                                            htmlFor: "first-name",
                                            className: "text-sm font-medium",
                                            children: "First name"
                                        }),
                                        /*#__PURE__*/ _jsx(Input, {
                                            id: "first-name",
                                            placeholder: "Max",
                                            required: true,
                                            onChange: (e)=>{
                                                setFirstName(e.target.value);
                                            },
                                            value: firstName,
                                            className: "w-full"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ _jsx(Label, {
                                            htmlFor: "last-name",
                                            className: "text-sm font-medium",
                                            children: "Last name"
                                        }),
                                        /*#__PURE__*/ _jsx(Input, {
                                            id: "last-name",
                                            placeholder: "Robinson",
                                            required: true,
                                            onChange: (e)=>{
                                                setLastName(e.target.value);
                                            },
                                            value: lastName,
                                            className: "w-full"
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ _jsx(Label, {
                                    htmlFor: "email",
                                    className: "text-sm font-medium",
                                    children: "Email"
                                }),
                                /*#__PURE__*/ _jsx(Input, {
                                    id: "email",
                                    type: "email",
                                    placeholder: "m@example.com",
                                    required: true,
                                    onChange: (e)=>{
                                        setEmail(e.target.value);
                                    },
                                    value: email,
                                    className: "w-full"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ _jsx(Label, {
                                    htmlFor: "password",
                                    className: "text-sm font-medium",
                                    children: "Password"
                                }),
                                /*#__PURE__*/ _jsx(PasswordInput, {
                                    id: "password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    autoComplete: "new-password",
                                    placeholder: "Password",
                                    className: "w-full"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ _jsx(Label, {
                                    htmlFor: "password_confirmation",
                                    className: "text-sm font-medium",
                                    children: "Confirm Password"
                                }),
                                /*#__PURE__*/ _jsx(PasswordInput, {
                                    id: "password_confirmation",
                                    value: passwordConfirmation,
                                    onChange: (e)=>setPasswordConfirmation(e.target.value),
                                    autoComplete: "new-password",
                                    placeholder: "Confirm Password",
                                    className: "w-full"
                                })
                            ]
                        }),
                        !admin && /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ _jsx(Label, {
                                    htmlFor: "image",
                                    className: "text-sm font-medium",
                                    children: "Profile Image (optional)"
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        imagePreview && /*#__PURE__*/ _jsx("div", {
                                            className: "relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0",
                                            children: /*#__PURE__*/ _jsx(Image, {
                                                src: imagePreview,
                                                alt: "Profile preview",
                                                fill: true,
                                                className: "object-cover"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex-1 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ _jsx(Input, {
                                                    id: "image",
                                                    type: "file",
                                                    accept: "image/*",
                                                    onChange: handleImageChange,
                                                    className: "w-full text-sm"
                                                }),
                                                imagePreview && /*#__PURE__*/ _jsx(Button, {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-8 w-8 flex-shrink-0",
                                                    onClick: ()=>{
                                                        setImage(null);
                                                        setImagePreview(null);
                                                    },
                                                    children: /*#__PURE__*/ _jsx(X, {
                                                        className: "h-4 w-4"
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs(Button, {
                            type: "submit",
                            className: "w-full",
                            disabled: loading,
                            onClick: async ()=>{
                                if (password !== passwordConfirmation) {
                                    toast.error('Please ensure your password and confirm password match.');
                                    return;
                                }
                                const user = await authClient.signUp.email({
                                    email,
                                    password,
                                    // @ts-ignore
                                    role: admin ? 'admin' : 'user',
                                    name: `${firstName} ${lastName}`,
                                    callbackURL: admin ? '/admin' : '/dashboard',
                                    fetchOptions: {
                                        onResponse: ()=>{
                                            setLoading(false);
                                        },
                                        onRequest: ()=>{
                                            setLoading(true);
                                        },
                                        onError: (ctx)=>{
                                            toast.error(ctx.error.message);
                                        },
                                        onSuccess: async ()=>{
                                            router.push(admin ? '/admin' : '/dashboard');
                                        }
                                    }
                                });
                                const userId = user.data?.user.id;
                                if (userId && admin) {
                                    await addAdminRole(userId);
                                }
                            },
                            children: [
                                loading ? /*#__PURE__*/ _jsx(Loader2, {
                                    size: 16,
                                    className: "animate-spin mr-2"
                                }) : null,
                                loading ? 'Creating account...' : 'Create an account'
                            ]
                        }),
                        !admin && /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "relative my-4",
                                    children: /*#__PURE__*/ _jsx("div", {
                                        className: "relative flex justify-center text-xs uppercase border-b border-muted pb-4",
                                        children: /*#__PURE__*/ _jsx("span", {
                                            className: "bg-card px-2 text-muted-foreground",
                                            children: "Or continue with"
                                        })
                                    })
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "grid grid-cols-4 gap-2 sm:grid-cols-7",
                                    children: [
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'github',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "GitHub",
                                            children: /*#__PURE__*/ _jsx(GitHubLogoIcon, {
                                                className: "h-4 w-4"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'discord',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Discord",
                                            children: /*#__PURE__*/ _jsx(DiscordLogoIcon, {
                                                className: "h-4 w-4"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'google',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Google",
                                            children: /*#__PURE__*/ _jsxs("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 256 262",
                                                children: [
                                                    /*#__PURE__*/ _jsx("path", {
                                                        fill: "#4285F4",
                                                        d: "M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                                    }),
                                                    /*#__PURE__*/ _jsx("path", {
                                                        fill: "#34A853",
                                                        d: "M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                                    }),
                                                    /*#__PURE__*/ _jsx("path", {
                                                        fill: "#FBBC05",
                                                        d: "M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                                                    }),
                                                    /*#__PURE__*/ _jsx("path", {
                                                        fill: "#EB4335",
                                                        d: "M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                const { data } = await authClient.signIn.social({
                                                    provider: 'microsoft',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Microsoft",
                                            children: /*#__PURE__*/ _jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ _jsx("path", {
                                                    fill: "currentColor",
                                                    d: "M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'twitch',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Twitch",
                                            children: /*#__PURE__*/ _jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ _jsx("path", {
                                                    fill: "currentColor",
                                                    d: "M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'facebook',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Facebook",
                                            children: /*#__PURE__*/ _jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ _jsx("path", {
                                                    fill: "currentColor",
                                                    d: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            variant: "outline",
                                            size: "icon",
                                            className: "h-10 w-10",
                                            onClick: async ()=>{
                                                await authClient.signIn.social({
                                                    provider: 'twitter',
                                                    callbackURL: '/dashboard'
                                                });
                                            },
                                            title: "Twitter",
                                            children: /*#__PURE__*/ _jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 14 14",
                                                children: /*#__PURE__*/ _jsxs("g", {
                                                    fill: "none",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("g", {
                                                            clipPath: "url(#primeTwitter0)",
                                                            children: /*#__PURE__*/ _jsx("path", {
                                                                fill: "currentColor",
                                                                d: "M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
                                                            })
                                                        }),
                                                        /*#__PURE__*/ _jsx("defs", {
                                                            children: /*#__PURE__*/ _jsx("clipPath", {
                                                                id: "primeTwitter0",
                                                                children: /*#__PURE__*/ _jsx("path", {
                                                                    fill: "#fff",
                                                                    d: "M0 0h14v14H0z"
                                                                })
                                                            })
                                                        })
                                                    ]
                                                })
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsx(CardFooter, {
                className: "flex flex-col",
                children: /*#__PURE__*/ _jsx("div", {
                    className: "w-full border-t pt-4",
                    children: /*#__PURE__*/ _jsxs("p", {
                        className: "text-center text-xs text-muted-foreground",
                        children: [
                            "Secured by",
                            ' ',
                            /*#__PURE__*/ _jsx(Link, {
                                className: "font-medium text-orange-500",
                                href: "https://github.com/forrestdevs/payload-better-auth",
                                children: "payload-better-auth"
                            })
                        ]
                    })
                })
            })
        ]
    });
}
async function convertImageToBase64(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

//# sourceMappingURL=sign-up.js.map