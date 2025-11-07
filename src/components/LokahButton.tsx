import React from "react";
import { motion } from "framer-motion";

export type LokahButtonProps = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const LokahButton = React.forwardRef<HTMLButtonElement, LokahButtonProps>(
  (
    { label, onClick, variant = "primary", icon, className, disabled, type = "button" },
    ref
  ) => {
  const base =
    "relative flex items-center justify-center px-8 py-3 font-satoshi font-semibold tracking-[0.03em] rounded-2xl transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D1A9FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] disabled:opacity-55 disabled:cursor-not-allowed";
  const primaryGradient = "bg-gradient-to-r from-[#B693FF] via-[#A3C0FF] to-[#71D0E3]";
  const secondaryStyle =
    "text-white/90 border border-white/20 backdrop-blur-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)]";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      className={`${base} ${
        variant === "primary"
          ? `${primaryGradient} text-white shadow-[0_0_14px_rgba(113,208,227,0.28)] hover:shadow-[0_0_20px_rgba(113,208,227,0.4)]`
          : secondaryStyle
      } ${className || ""}`}
      whileHover={
        !disabled
          ? {
              scale: 1.04,
              boxShadow: "0 0 16px rgba(182,147,255,0.4)",
            }
          : undefined
      }
      whileTap={!disabled ? { scale: 0.96, opacity: 0.9 } : undefined}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-lg flex items-center">{icon}</span>}
        {label}
      </span>
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
        />
      )}
      {/* subtle radial glass overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_60%,transparent_100%)]" />
    </motion.button>
  );
});

LokahButton.displayName = "LokahButton";

export default LokahButton;