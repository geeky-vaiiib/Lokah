import { motion } from "framer-motion";
import type React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export const GlassButton: React.FC<Props> = ({
  label,
  onClick,
  className,
  type = "button",
  disabled,
  variant = "primary"
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`relative px-5 py-3 rounded-xl font-medium backdrop-blur-lg border border-white/10 transition-all ${
        isPrimary
          ? "text-white bg-[linear-gradient(90deg,#B693FF33,#71D0E333)] hover:shadow-[0_0_25px_rgba(113,208,227,0.3)]"
          : "text-[#A6CFFF] bg-[#13213A]/40 hover:bg-[#13213A]/70"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className ?? ""}`}
    >
      {isPrimary ? (
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B693FF] to-[#71D0E3]">
          {label}
        </span>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
};

export default GlassButton;
