import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DimensionCardProps {
    value: string;
    label: string;
    description: string;
    icon: LucideIcon;
    isSelected?: boolean;
    onClick: () => void;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
    value,
    label,
    description,
    icon: Icon,
    isSelected = false,
    onClick,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.98 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            className={`
        group relative flex flex-col p-6 rounded-2xl cursor-pointer 
        transition-all duration-300 overflow-hidden
        ${isSelected
                    ? "bg-[hsl(35_35%_65%/0.08)] border-[hsl(35_35%_65%/0.5)] shadow-[0_0_40px_-10px_hsl(35_35%_65%/0.4)]"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-[hsl(35_35%_65%/0.3)] hover:bg-white/[0.04]"
                } 
        border backdrop-blur-sm
      `}
        >
            {/* Holographic Rainbow Reflection */}
            <div
                className={`
          absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500
          ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
        `}
                style={{
                    background: isHovered ? `
            linear-gradient(
              ${(mouseX.get() + 0.5) * 180}deg,
              hsl(35 35% 65% / 0.1) 0%,
              hsl(42 100% 55% / 0.08) 25%,
              hsl(175 85% 55% / 0.05) 50%,
              hsl(42 100% 65% / 0.08) 75%,
              hsl(35 35% 65% / 0.1) 100%
            )
          ` : undefined,
                }}
            />

            {/* Gradient Glow Blob */}
            <motion.div
                className={`
          absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none
          transition-opacity duration-500
          ${isSelected ? 'opacity-80' : 'opacity-0 group-hover:opacity-40'}
        `}
                style={{
                    background: 'radial-gradient(circle, hsl(35 35% 65% / 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    scale: isSelected ? [1, 1.1, 1] : 1,
                }}
                transition={{
                    duration: 3,
                    repeat: isSelected ? Infinity : 0,
                    ease: "easeInOut",
                }}
            />

            {/* Header: Icon + Selection Indicator */}
            <div className="flex items-start justify-between mb-5 relative z-10">
                <motion.div
                    className={`
            p-3.5 rounded-xl transition-all duration-300
            ${isSelected
                            ? "bg-[hsl(35_35%_65%)] text-[#030508] shadow-[0_0_20px_-5px_hsl(35_35%_65%/0.6)]"
                            : "bg-white/[0.06] text-white/80 group-hover:bg-white/[0.1] group-hover:text-white"
                        }
          `}
                    style={{ transform: "translateZ(20px)" }}
                >
                    <Icon size={22} strokeWidth={1.5} />
                </motion.div>

                {/* Selection Ring */}
                <div
                    className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center 
            transition-all duration-300
            ${isSelected
                            ? "border-[hsl(35_35%_65%)] bg-[hsl(35_35%_65%)] shadow-[0_0_15px_-3px_hsl(35_35%_65%/0.5)]"
                            : "border-white/20 group-hover:border-white/40"
                        }
          `}
                >
                    {isSelected && (
                        <motion.div
                            className="w-2 h-2 rounded-full bg-[#030508]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-auto" style={{ transform: "translateZ(15px)" }}>
                <h3
                    className={`
            text-xl font-display font-semibold mb-2 transition-colors duration-300
            ${isSelected ? "text-[hsl(35_35%_65%)]" : "text-white"}
          `}
                >
                    {label}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                    {description}
                </p>
            </div>

            {/* Data Stream Overlay (when selected) */}
            {isSelected && (
                <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                    style={{
                        background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                hsl(35 35% 65% / 0.03) 2px,
                hsl(35 35% 65% / 0.03) 4px
              )
            `,
                        backgroundSize: '100% 8px',
                        animation: 'scan 2s linear infinite',
                    }}
                />
            )}

            {/* Pulse Ring Animation (when selected) */}
            {isSelected && (
                <motion.div
                    className="absolute -inset-1 rounded-2xl border border-[hsl(35_35%_65%/0.3)] pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: [0.5, 0, 0.5],
                        scale: [0.98, 1.02, 0.98]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
        </motion.div>
    );
};
