import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HolocardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glowColor?: string;
}

export const Holocard: React.FC<HolocardProps> = ({
    children,
    className = "",
    intensity = 15,
    glowColor = "190 80% 62%",
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

    // Edge light position
    const edgeLightX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
    const edgeLightY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

    // Shimmer position
    const shimmerX = useTransform(mouseX, [-0.5, 0.5], ['-20%', '120%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1200,
            }}
            className={`relative group ${className}`}
        >
            {/* 3D Content Layer */}
            <motion.div
                style={{ transform: "translateZ(40px)" }}
                className="relative z-20"
            >
                {children}
            </motion.div>

            {/* Holographic Shimmer Layer */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(
            105deg,
            transparent 0%,
            hsl(${glowColor} / 0.1) 45%,
            hsl(${glowColor} / 0.2) 50%,
            hsl(${glowColor} / 0.1) 55%,
            transparent 100%
          )`,
                    backgroundPosition: shimmerX,
                    backgroundSize: '200% 100%',
                }}
            />

            {/* Edge Light Effect */}
            <motion.div
                className="absolute -inset-[1px] z-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(
            circle at ${edgeLightX} ${edgeLightY},
            hsl(${glowColor} / 0.4) 0%,
            transparent 50%
          )`,
                }}
            />

            {/* Depth Shadow Layer */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none rounded-3xl"
                style={{
                    transform: "translateZ(-20px)",
                    boxShadow: `
            0 20px 40px -20px hsl(0 0% 0% / 0.4),
            0 0 60px -20px hsl(${glowColor} / 0.2)
          `,
                }}
            />

            {/* Reflection/Gloss Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    background: `linear-gradient(
            135deg, 
            hsl(0 0% 100% / 0.08) 0%, 
            transparent 40%,
            transparent 60%,
            hsl(0 0% 100% / 0.03) 100%
          )`,
                }}
            />

            {/* Prismatic Edge Highlight */}
            <div
                className="absolute inset-0 z-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                    background: `conic-gradient(
            from 0deg at 50% 50%,
            hsl(35 35% 65% / 0.1),
            hsl(42 100% 55% / 0.1),
            hsl(175 85% 55% / 0.1),
            hsl(42 100% 65% / 0.1),
            hsl(35 35% 65% / 0.1)
          )`,
                    filter: 'blur(1px)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                }}
            />
        </motion.div>
    );
};
