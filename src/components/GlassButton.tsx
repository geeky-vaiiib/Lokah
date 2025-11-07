import React from "react";
import { motion } from "framer-motion";
import { LOKAH_THEME } from "@/styles/theme";

type Props = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  leftIcon?: React.ReactNode;
};

export const GlassButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    { label, onClick, className, type = "button", disabled, variant = "primary", leftIcon },
    ref
  ) => {
    const isPrimary = variant === "primary";

    return (
      <motion.button
        whileHover={!disabled ? { scale: 1.03 } : undefined}
        whileTap={!disabled ? { scale: 0.97, opacity: 0.95 } : undefined}
        animate={isPrimary ? { boxShadow: [
          "0 0 18px rgba(151,255,224,0.24)",
          "0 0 28px rgba(151,255,224,0.34)",
          "0 0 18px rgba(151,255,224,0.24)"
        ] } : undefined}
        transition={isPrimary ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : undefined}
        onClick={onClick}
        type={type}
        disabled={disabled}
        ref={ref}
        className={`relative inline-flex items-center justify-center rounded-2xl px-6 py-3 font-satoshi font-semibold tracking-wide text-white transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D1A9FF]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${
          isPrimary
            ? "" // gradient is applied via overlay layer for consistent animation
            : "text-[#A6CFFF] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.1)] backdrop-blur-xl"
        } ${className ?? ""}`}
        style={{
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
          boxShadow: isPrimary
            ? "0 0 18px rgba(151,255,224,0.24)"
            : "0 0 12px rgba(113,208,227,0.12)",
          border: isPrimary ? "1px solid rgba(255,255,255,0.14)" : undefined,
        }}
      >
        {isPrimary && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: LOKAH_THEME.gradient, opacity: 0.95 }}
          />
        )}
        {/* animated shimmer */}
        {isPrimary && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />
        )}
        {/* glass overlay subtle */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_42%,rgba(255,255,255,0.04)_60%,transparent_100%)]" />
        <span className="relative z-10 inline-flex items-center gap-2">
          {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
          {label}
        </span>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;
