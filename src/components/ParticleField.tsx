import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  layer: number; // Z-depth layer
}

interface ParticleFieldProps {
  particleCount?: number;
  className?: string;
}

export function ParticleField({ particleCount = 50, className = "" }: ParticleFieldProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];

      // Layer 1: Closest particles (softly blurred orbs, opacity 0.2)
      for (let i = 0; i < particleCount * 0.3; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 8 + 12,
          delay: Math.random() * 3,
          layer: 1,
        });
      }

      // Layer 2: Mid-distance drifting sparks (opacity 0.05)
      for (let i = particleCount * 0.3; i < particleCount * 0.7; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.08 + 0.02,
          duration: Math.random() * 12 + 18,
          delay: Math.random() * 5,
          layer: 2,
        });
      }

      // Layer 3: Background nebulous gradient overlay (opacity 0.03)
      for (let i = particleCount * 0.7; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 3,
          opacity: Math.random() * 0.06 + 0.01,
          duration: Math.random() * 15 + 20,
          delay: Math.random() * 8,
          layer: 3,
        });
      }

      setParticles(newParticles);
    };

    generateParticles();
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map((particle) => {
        // Different behaviors based on layer
        const getLayerStyles = (layer: number) => {
          switch (layer) {
            case 1: // Closest layer - softly blurred orbs (cosmic consciousness)
              return {
                background: `radial-gradient(circle, rgba(234, 219, 200, ${particle.opacity}) 0%, rgba(185, 154, 255, ${particle.opacity * 0.5}) 50%, transparent 100%)`,
                filter: 'blur(1px)',
                zIndex: 10,
              };
            case 2: // Mid layer - drifting sparks (multiverse particles)
              return {
                background: `radial-gradient(circle, rgba(185, 154, 255, ${particle.opacity}) 0%, rgba(106, 209, 227, ${particle.opacity * 0.3}) 70%, transparent 100%)`,
                filter: 'blur(0.5px)',
                zIndex: 5,
              };
            case 3: // Background layer - nebulous overlay (cosmic dust)
              return {
                background: `radial-gradient(ellipse, rgba(185, 154, 255, ${particle.opacity}) 0%, rgba(106, 209, 227, ${particle.opacity * 0.2}) 40%, transparent 100%)`,
                filter: 'blur(2px)',
                zIndex: 1,
              };
            default:
              return {};
          }
        };

        const getLayerAnimation = (layer: number) => {
          const baseX = Math.random() * 100 - 50;
          const baseY = Math.random() * 100 - 50;

          switch (layer) {
            case 1: // Closest - more movement
              return {
                x: [0, baseX * 1.2, 0],
                y: [0, baseY * 1.2, 0],
                opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
                scale: [1, 1.3, 1],
              };
            case 2: // Mid - moderate movement
              return {
                x: [0, baseX, 0],
                y: [0, baseY, 0],
                opacity: [particle.opacity, particle.opacity * 0.7, particle.opacity],
                scale: [1, 1.1, 1],
              };
            case 3: // Background - subtle movement
              return {
                x: [0, baseX * 0.5, 0],
                y: [0, baseY * 0.5, 0],
                opacity: [particle.opacity, particle.opacity * 0.8, particle.opacity],
                scale: [1, 1.05, 1],
              };
            default:
              return {};
          }
        };

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              ...getLayerStyles(particle.layer),
            }}
            animate={getLayerAnimation(particle.layer)}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
