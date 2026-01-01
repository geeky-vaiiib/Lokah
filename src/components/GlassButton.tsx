import React, { useState } from "react";
import { motion } from "framer-motion";

interface GlassButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = "primary",
  size = "md",
  onClick,
  label,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantStyles = {
    primary: `
      bg-[hsl(35_35%_65%/0.12)] 
      border-[hsl(35_35%_65%/0.25)] 
      text-[hsl(38_40%_85%)]
      hover:bg-[hsl(35_35%_65%/0.18)] 
      hover:border-[hsl(35_35%_65%/0.4)]
      hover:text-[hsl(45_50%_92%)]
      hover:shadow-[0_0_20px_-5px_hsl(35_35%_65%/0.25)]
    `,
    secondary: `
      bg-[hsl(30_12%_14%/0.7)] 
      border-[hsl(30_12%_20%)] 
      text-[hsl(35_20%_70%)]
      hover:bg-[hsl(30_12%_16%/0.85)] 
      hover:border-[hsl(30_12%_25%)]
      hover:text-[hsl(38_30%_85%)]
    `,
    ghost: `
      bg-transparent 
      border-transparent 
      text-[hsl(35_20%_60%)]
      hover:bg-[hsl(30_12%_15%/0.5)]
      hover:text-[hsl(38_30%_85%)]
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative overflow-hidden rounded-lg
        border font-medium tracking-wide
        transition-all duration-200 ease-out
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Shimmer on primary */}
      {variant === "primary" && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, hsl(35 35% 65% / 0.12), transparent)",
          }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
      </span>
    </motion.button>
  );
};
