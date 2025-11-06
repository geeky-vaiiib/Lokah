import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function MultiverseOrb({ size = 44 }: { size?: number }) {
  const prefersReduced = useReducedMotion();
  const rotateAnim = prefersReduced ? {} : { rotate: [0, 360], transition: { duration: 28, repeat: Infinity } };

  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="orb-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#EADBC8" />
          <stop offset="0.5" stopColor="#B99AFF" />
          <stop offset="1" stopColor="#6AD1E3" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <motion.g animate={rotateAnim} style={{ transformOrigin: "center" }}>
          <circle cx="0" cy="0" r="38" fill="none" stroke="url(#orb-grad)" strokeWidth="1.6" opacity="0.22" />
          <circle cx="0" cy="0" r="26" fill="none" stroke="url(#orb-grad)" strokeWidth="1.2" opacity="0.14" />
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 26;
            const y = Math.sin(angle) * 26;
            return <circle key={i} cx={x} cy={y} r="3" fill="url(#orb-grad)" opacity="0.95" />;
          })}
        </motion.g>
      </g>
    </motion.svg>
  );
}
