import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface PortalButtonProps extends HTMLMotionProps<"button"> {
    label: string;
}

export const PortalButton: React.FC<PortalButtonProps> = ({
    label,
    className = "",
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group px-10 py-5 bg-transparent border-none outline-none cursor-pointer ${className}`}
            {...props}
        >
            {/* 1. Core Background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4CC9F0]/20 to-[#D4A000]/20 blur-sm group-hover:blur-md transition-all duration-300" />

            {/* 2. Rotating Rings (Portal Frame) */}
            <div className="absolute inset-0 rounded-full border border-[#4CC9F0]/50 group-hover:border-[#4CC9F0] transition-colors duration-300 pointer-events-none" />
            <div className="absolute -inset-1 rounded-full border border-[#D4A000]/30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none opacity-50 group-hover:opacity-100" />

            {/* 3. Text Content */}
            <span className="relative z-10 text-lg font-[ClashDisplay] font-medium tracking-widest text-white uppercase group-hover:text-holographic transition-all duration-300">
                {label}
            </span>

            {/* 4. Glow Flare */}
            <div className="absolute -inset-4 bg-brand-teal/10 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 rounded-full" />
        </motion.button>
    );
};
