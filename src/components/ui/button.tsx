import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: accessible, smooth, and crisp button
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transform-gpu will-change-transform " +
    // Smooth transitions: 150ms for hover, 220ms for focus, custom easing
    "transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:duration-[220ms] " +
    // Focus visibility and ring (3px) with offset for contrast
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#71D0E3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 dark:focus-visible:ring-offset-slate-900 " +
    // Disabled state and icon sizing
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
    // Subtle shadow baseline and hover transform
    "shadow-sm shadow-sky-500/10 hover:shadow-md hover:shadow-sky-500/20 hover:scale-[1.02] hover:-translate-y-px",
  {
    variants: {
      variant: {
        default:
          // Primary: clean gradient with accessible text
          "text-white border border-white/10 bg-[linear-gradient(90deg,#B693FF,#71D0E3)] hover:brightness-[1.06]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          // Subtle glass outline
          "text-[#A6CFFF] border border-white/10 bg-[#13213A]/40 hover:bg-[#13213A]/70",
        secondary:
          // Solid gradient CTA
          "text-white bg-[linear-gradient(90deg,#B693FF,#71D0E3)] hover:brightness-[1.06]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-transparent bg-clip-text bg-[linear-gradient(90deg,#B693FF,#71D0E3)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
