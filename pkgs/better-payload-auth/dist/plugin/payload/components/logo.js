import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export default function Logo() {
    return /*#__PURE__*/ _jsxs("div", {
        className: "flex items-center justify-center w-full mb-8",
        children: [
            /*#__PURE__*/ _jsx("svg", {
                width: "60",
                height: "45",
                viewBox: "0 0 60 45",
                fill: "none",
                className: "w-5 h-5",
                xmlns: "http://www.w3.org/2000/svg",
                children: /*#__PURE__*/ _jsx("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M0 0H15V15H30V30H15V45H0V30V15V0ZM45 30V15H30V0H45H60V15V30V45H45H30V30H45Z",
                    className: "fill-black dark:fill-white"
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "ml-2 font-semibold text-black dark:text-white",
                children: [
                    "Payload ",
                    /*#__PURE__*/ _jsx("span", {
                        className: "text-blue-600 dark:text-blue-400",
                        children: "×"
                    }),
                    " Better Auth"
                ]
            })
        ]
    });
}

//# sourceMappingURL=logo.js.map