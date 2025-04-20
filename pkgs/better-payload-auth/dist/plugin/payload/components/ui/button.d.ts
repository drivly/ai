import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (props?: {
    variant?: "link" | "default" | "outline" | "secondary" | "destructive" | "ghost";
    size?: "default" | "icon" | "lg" | "sm";
} & import("class-variance-authority/types").ClassProp) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): React.JSX.Element;
export { Button, buttonVariants };
//# sourceMappingURL=button.d.ts.map