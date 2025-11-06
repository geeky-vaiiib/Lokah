import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function MultiverseSymbol({ size = 48, className = "" }: { size?: number; className?: string }) {
  const S = Number(size) || 48;
  const R = S / 2;
  const prefersReduced = useReducedMotion();

  const rotateVariant = {
    animate: prefersReduced ? {} : { rotate: [0, 360], transition: { repeat: Infinity, duration: 28 } }
  };

  return (
    <motion.svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id="mv-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#EADBC8" />
          <stop offset="0.5" stopColor="#B99AFF" />
          <stop offset="1" stopColor="#6AD1E3" />
        </linearGradient>
        <filter id="mv-blur" x="-50%" width="200%">
          <feGaussianBlur stdDeviation={2} />
        </filter>
      </defs>

      <g transform={`translate(${R},${R})`} style={{ transformOrigin: "center" }}>
        <motion.circle cx={0} cy={0} r={R * 0.78} fill="none" stroke="url(#mv-grad)" strokeWidth={1.6} opacity={0.22} />
        <motion.g variants={rotateVariant} animate="animate" style={{ transformOrigin: "center" }}>
          {/* orbit thin rings */}
          <circle cx={0} cy={0} r={R * 0.56} fill="none" stroke="url(#mv-grad)" strokeWidth={1} opacity={0.14} />
          <circle cx={0} cy={0} r={R * 0.28} fill="none" stroke="url(#mv-grad)" strokeWidth={1} opacity={0.12} />
          {/* orbiting nodes (simple 6 dots) */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * R * 0.56;
            const y = Math.sin(angle) * R * 0.56;
            return <circle key={i} cx={x} cy={y} r={Math.max(1.2, R * 0.06)} fill="url(#mv-grad)" opacity={0.95} />;
          })}
        </motion.g>
      </g>
    </motion.svg>
  );
}
