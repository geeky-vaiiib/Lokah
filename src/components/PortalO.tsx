import { motion } from "framer-motion";
import React from "react";
import { LOKAH_THEME } from "@/styles/theme";

interface PortalOProps {
  size?: number;
  strokeWidth?: number;
  subtle?: boolean; // reduce glow for compact placements
  className?: string;
  diagonal?: boolean;
}

export function PortalO({ size = 48, strokeWidth = 1, subtle = false, className, diagonal = false }: PortalOProps) {
  const glowOpacity = subtle ? 0.06 : 0.14;
  const ringStroke = "rgba(255,255,255,0.82)";

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className || ""}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 28, ease: "linear", repeat: Infinity }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(198,184,255,${glowOpacity}) 0%, rgba(129,230,255,0) 60%)`,
          filter: subtle ? "none" : LOKAH_THEME.glow,
        }}
      />
      {/* SVG O with precise 1px stroke */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 1) / 2}
          stroke={ringStroke}
          strokeWidth={strokeWidth}
          fill="none"
          style={{ filter: "drop-shadow(0 0 4px rgba(151,255,224,0.3))" }}
        />
        {diagonal && (
          <line
            x1={size * 0.28}
            y1={size * 0.18}
            x2={size * 0.72}
            y2={size * 0.82}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={strokeWidth * 0.85}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(129,230,255,0.35))" }}
          />
        )}
      </svg>
    </motion.div>
  );
}

export default PortalO;