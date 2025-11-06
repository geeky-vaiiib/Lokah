// src/components/LokahO.tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * LokahO: viewBox-based SVG that sizes via CSS (height:1em).
 * - No numeric props required (safe defaults).
 * - Rotating long line inside O is animated on a <g> transform only.
 * - All svg coordinates are fixed in the 0..100 coordinate space to avoid undefined attrs.
 */
export default function LokahO({ className = "" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  // Animations: subtle, long duration
  const rotateVariant = {
    animate: prefersReduced
      ? {}
      : {
          rotate: [0, 360],
          transition: { repeat: Infinity, duration: 40 }, // long constant rotation
        },
  };
  const pulseVariant = {
    animate: prefersReduced
      ? {}
      : {
          opacity: [0.22, 0.42, 0.22],
          transition: { repeat: Infinity, duration: 9 },
        },
  };

  return (
    <motion.svg
      className={`lokah-o ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lokah O symbol"
      initial="initial"
      animate="animate"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <radialGradient id="lokah-grad" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#EADBC8" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#B99AFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6AD1E3" stopOpacity="0.85" />
        </radialGradient>

        <linearGradient id="lokah-line-grad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#EADBC8" />
          <stop offset="50%" stopColor="#B99AFF" />
          <stop offset="100%" stopColor="#6AD1E3" />
        </linearGradient>

        <filter id="lokah-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(50,50)">
        {/* Outer ring: a perfect circle centered at (50,50) with radius 40 */}
        <circle
          cx="0"
          cy="0"
          r="38"
          fill="none"
          stroke="url(#lokah-grad)"
          strokeWidth="4"
          filter="url(#lokah-glow)"
        />

        {/* faint implied triangle arcs to suggest Deathly Hallows (very low opacity) */}
        <path d={arcPath(0, 0, 30, -90, -10)} fill="none" stroke="#B99AFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.10" />
        <path d={arcPath(0, 0, 30, 30, 110)} fill="none" stroke="#B99AFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.10" />
        <path d={arcPath(0, 0, 30, 130, 210)} fill="none" stroke="#B99AFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.10" />

        {/* inner portal ring */}
        <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />

        {/* rotating long vertical line — we animate the group, not r/cx/cy */}
        <motion.g style={{ transformOrigin: "center" }} variants={rotateVariant} animate="animate">
          <line x1="0" y1="-70" x2="0" y2="70" stroke="url(#lokah-line-grad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.28" />
        </motion.g>

        {/* inner glowing stone that pulses */}
        <motion.circle cx="0" cy="0" r="6" fill="#B99AFF" opacity="0.28" variants={pulseVariant} animate="animate" style={{ filter: "blur(3px)" }} />
      </g>
    </motion.svg>
  );
}

/* small helper to create an arc path inside the 100x100 viewbox using degrees */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const largeArc = (endDeg - startDeg) % 360 > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
