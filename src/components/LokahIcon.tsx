import { motion } from "framer-motion";
import React from "react";

interface LokahIconProps {
    size?: number;
    className?: string;
    animated?: boolean;
}

/**
 * Lokah Icon - Warm beige elegant design
 */
export const LokahIcon: React.FC<LokahIconProps> = ({
    size = 48,
    className = "",
    animated = true
}) => {
    const id = React.useId();
    const gradId = `lokah-grad-${id}`;
    const glowId = `lokah-glow-${id}`;

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                <defs>
                    {/* Beige to Copper gradient */}
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(38, 40%, 80%)" />
                        <stop offset="50%" stopColor="hsl(35, 35%, 65%)" />
                        <stop offset="100%" stopColor="hsl(25, 55%, 50%)" />
                    </linearGradient>

                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <radialGradient id={`${gradId}-center`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(45, 50%, 95%)" />
                        <stop offset="60%" stopColor="hsl(38, 40%, 75%)" />
                        <stop offset="100%" stopColor="hsl(35, 35%, 65%)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Outer ring */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="1.5"
                    strokeOpacity="0.25"
                    animate={animated ? { rotate: 360 } : undefined}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "50px 50px" }}
                />

                {/* Main ring */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="55 135"
                    filter={`url(#${glowId})`}
                    animate={animated ? { rotate: 360 } : undefined}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "50px 50px" }}
                />

                {/* Inner ring */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="22"
                    fill="none"
                    stroke="hsl(35, 35%, 65%)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="30 110"
                    strokeOpacity="0.4"
                    animate={animated ? { rotate: -360 } : undefined}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "50px 50px" }}
                />

                {/* L Symbol */}
                <motion.g
                    animate={animated ? { opacity: [0.85, 1, 0.85] } : undefined}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.path
                        d="M 40 30 L 40 58"
                        stroke={`url(#${gradId})`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        filter={`url(#${glowId})`}
                    />
                    <motion.path
                        d="M 40 58 L 58 58"
                        stroke={`url(#${gradId})`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        filter={`url(#${glowId})`}
                    />
                </motion.g>

                {/* Center */}
                <motion.circle
                    cx="50"
                    cy="44"
                    r="3"
                    fill={`url(#${gradId}-center)`}
                    animate={animated ? {
                        scale: [0.9, 1.1, 0.9],
                        opacity: [0.7, 1, 0.7]
                    } : undefined}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Accent particles */}
                <motion.circle
                    cx="72"
                    cy="28"
                    r="1.5"
                    fill="hsl(35, 35%, 65%)"
                    animate={animated ? { opacity: [0.2, 0.5, 0.2] } : undefined}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.circle
                    cx="28"
                    cy="72"
                    r="1"
                    fill="hsl(25, 55%, 50%)"
                    animate={animated ? { opacity: [0.2, 0.4, 0.2] } : undefined}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
            </motion.svg>
        </div>
    );
};
