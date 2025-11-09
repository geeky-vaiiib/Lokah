import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps { label: string; onClick?: () => void; className?: string }

export const GlassButton: React.FC<GlassButtonProps> = ({ label, onClick, className }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`px-6 py-3 rounded-2xl backdrop-blur-lg border border-white/20 bg-white/5 text-white relative overflow-hidden ${className || ''}`}
  >
    <span className="absolute inset-0 bg-[var(--lokah-gradient)] opacity-25 transition-all duration-500" />
    <span className="relative z-10 font-semibold tracking-wide">{label}</span>
  </motion.button>
);

export default GlassButton;
