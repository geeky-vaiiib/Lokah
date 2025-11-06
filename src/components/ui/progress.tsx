import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#1B2436]/70 backdrop-blur-md",
      "shadow-[0_0_12px_rgba(113,208,227,0.12)] h-2",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1",
        "bg-[linear-gradient(90deg,#B693FF_0%,#71D0E3_100%)]",
        "shadow-[0_0_10px_rgba(113,208,227,0.4)]",
        "transition-transform duration-500 ease-out",
        "rounded-xl",
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
