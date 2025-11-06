import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-xl border border-white/10 bg-[#1B2436]/70 px-4 py-3 text-base text-white placeholder:text-gray-400",
        "backdrop-blur-md transition focus:outline-none focus:ring-2 focus:ring-[#71D0E3]/40",
        "shadow-[inset_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_0_10px_rgba(113,208,227,0.3)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
