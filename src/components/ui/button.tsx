import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          // Lokah Primary (glass-gradient)
          "text-white backdrop-blur-lg border border-white/10 bg-[linear-gradient(90deg,#B693FF33,#71D0E333)] hover:shadow-[0_0_25px_rgba(113,208,227,0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          // Lokah Outline/Secondary look
          "text-[#A6CFFF] border border-white/10 bg-[#13213A]/40 hover:bg-[#13213A]/70",
        secondary:
          // Lokah CTA (solid gradient)
          "text-white bg-[linear-gradient(90deg,#B693FF,#71D0E3)] shadow-[0_0_20px_rgba(113,208,227,0.25)] hover:brightness-110",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-transparent bg-clip-text bg-[linear-gradient(90deg,#B693FF,#71D0E3)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 rounded-lg px-3",
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
