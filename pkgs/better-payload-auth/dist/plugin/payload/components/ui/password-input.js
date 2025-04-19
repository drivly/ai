'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from './cn';
export function PasswordInput({ className, ...props }) {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled = props.value === '' || props.value === undefined || props.disabled;
    return /*#__PURE__*/ _jsxs("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ _jsx(Input, {
                ...props,
                type: showPassword ? 'text' : 'password',
                name: "password_fake",
                className: cn('hide-password-toggle pr-10', className)
            }),
            /*#__PURE__*/ _jsxs(Button, {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                onClick: ()=>setShowPassword((prev)=>!prev),
                disabled: disabled,
                children: [
                    showPassword && !disabled ? /*#__PURE__*/ _jsx(EyeIcon, {
                        className: "h-4 w-4",
                        "aria-hidden": "true"
                    }) : /*#__PURE__*/ _jsx(EyeOffIcon, {
                        className: "h-4 w-4",
                        "aria-hidden": "true"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "sr-only",
                        children: showPassword ? 'Hide password' : 'Show password'
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("style", {
                children: `
		.hide-password-toggle::-ms-reveal,
		.hide-password-toggle::-ms-clear {
			visibility: hidden;
			pointer-events: none;
			display: none;
		}
	`
            })
        ]
    });
}

//# sourceMappingURL=password-input.js.map