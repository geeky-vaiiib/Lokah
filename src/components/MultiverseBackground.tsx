import { motion } from "framer-motion";
import React, { useRef } from "react";

export const MultiverseBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#030508]">
            {/* Layer 0: Deep Space Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030508] via-[#050810] to-[#0A0F1C]" />

            {/* Layer 1: Perspective Grid (Horizon) */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(76, 201, 240, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(76, 201, 240, 0.1) 1px, transparent 1px)
                     `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)',
                    transformOrigin: 'bottom center',
                    maskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
                }}
            />

            {/* Layer 2: Subtle Distant Stars */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`star-distant-${i}`}
                        className="absolute bg-white rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`, // Only in upper sky
                            width: Math.random() * 1.5 + 'px',
                            height: Math.random() * 1.5 + 'px',
                        }}
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 3 + Math.random() * 5, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Layer 3: Ambient Glow (Corner) */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Layer 4: Floating Dust */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={`dust-${i}`}
                    className="absolute bg-brand-gold rounded-full opacity-20"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: '1px',
                        height: '1px',
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};
