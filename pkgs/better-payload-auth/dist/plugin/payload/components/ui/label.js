'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from './cn';
function Label({ className, ...props }) {
    return /*#__PURE__*/ _jsx(LabelPrimitive.Root, {
        "data-slot": "label",
        className: cn('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    });
}
export { Label };

//# sourceMappingURL=label.js.map