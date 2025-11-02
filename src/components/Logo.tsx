import { motion } from "framer-motion";
import logoMark from "@/assets/lokah-mark.png";
import logoHorizontal from "@/assets/lokah-horizontal.png";

interface LogoProps {
  variant?: "mark" | "horizontal" | "stacked";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function Logo({ 
  variant = "horizontal", 
  size = "md", 
  animated = true,
  className = "" 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  if (variant === "mark") {
    return (
      <motion.div
        className={`inline-block ${className}`}
        initial={animated ? { opacity: 0, scale: 0.9 } : undefined}
        animate={animated ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={logoMark} 
          alt="Lokah - Discover Your Parallel Self" 
          className={sizeClasses[size]}
        />
      </motion.div>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.div
        className={`inline-block ${className}`}
        initial={animated ? { opacity: 0, y: -10 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={logoHorizontal} 
          alt="Lokah - Discover Your Parallel Self" 
          className={sizeClasses[size]}
        />
      </motion.div>
    );
  }

  // Stacked variant
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={animated ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <motion.img 
        src={logoMark} 
        alt="" 
        className={sizeClasses[size]}
        animate={animated ? {
          scale: [1, 1.02, 1],
          opacity: [1, 0.9, 1],
        } : undefined}
        transition={animated ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        } : undefined}
      />
      <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins' }}>
        Lokah
      </span>
    </motion.div>
  );
}
