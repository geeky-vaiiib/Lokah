import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface CosmicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    loading?: boolean;
    size?: 'md' | 'lg';
}

export const CosmicButton: React.FC<CosmicButtonProps> = ({
    label,
    onClick,
    className = "",
    loading = false,
    size = 'lg',
    disabled,
    ...props
}) => {
    const divRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const glowOpacity = useSpring(0, { stiffness: 200, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!divRef.current || disabled || loading) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        if (!disabled && !loading) {
            setIsHovered(true);
            glowOpacity.set(1);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        glowOpacity.set(0);
    };

    const sizeStyles = {
        md: "px-8 py-3.5 text-sm",
        lg: "px-10 py-4 text-base",
    };

    return (
        <motion.div className="relative inline-block">
            {/* Glow */}
            <motion.div
                className="absolute -inset-3 rounded-full blur-xl pointer-events-none"
                style={{
                    opacity: glowOpacity,
                    background: `radial-gradient(ellipse at center, hsl(35 35% 65% / 0.2) 0%, transparent 70%)`,
                }}
            />

            <button
                ref={divRef}
                onClick={loading || disabled ? undefined : onClick}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={disabled || loading}
                className={`
          relative rounded-full ${sizeStyles[size]} overflow-hidden group 
          bg-[hsl(30_12%_9%)] border border-[hsl(35_35%_65%/0.2)]
          transition-all duration-300
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[hsl(35_35%_65%/0.35)]'}
          ${className}
        `}
                {...props}
            >
                {/* Spotlight */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 rounded-full"
                    style={{
                        opacity: isHovered ? 0.7 : 0,
                        background: `radial-gradient(250px circle at ${position.x}px ${position.y}px, hsl(35 35% 65% / 0.15), transparent 50%)`,
                    }}
                />

                {/* Inner bg */}
                <div className="absolute inset-[1px] rounded-full bg-[hsl(30_12%_7%)]" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                        <motion.div
                            className="w-4 h-4 border-2 border-[hsl(35_35%_65%/0.3)] border-t-[hsl(35_35%_65%)] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    ) : (
                        <>
                            <span className={`font-['Clash_Display'] tracking-[0.1em] font-semibold uppercase transition-colors duration-200 ${isHovered ? 'text-[hsl(45_50%_92%)]' : 'text-[hsl(38_40%_85%)]'}`}>
                                {label}
                            </span>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-[hsl(25_55%_55%)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                animate={{ x: isHovered ? 3 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </motion.svg>
                        </>
                    )}
                </div>
            </button>
        </motion.div>
    );
};
