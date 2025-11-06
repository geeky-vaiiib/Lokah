import { motion } from 'framer-motion';

interface AnimatedOProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function AnimatedO({ size = 'md', className = '' }: AnimatedOProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  // Calculate dimensions based on size for proper scaling
  const getDimensions = (size: string) => {
    const baseSize = 100;
    switch (size) {
      case 'sm': return baseSize * 0.6;
      case 'md': return baseSize * 0.8;
      case 'lg': return baseSize * 1.2;
      case 'xl': return baseSize * 1.6;
      default: return baseSize;
    }
  };

  const svgSize = getDimensions(size);

  return (
    <motion.div
      className={`${sizeMap[size]} mx-auto ${className} flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        className="drop-shadow-sm"
        animate={{
          rotate: [0, 2, -2, 0], // Very slow Y-axis turn (±2° oscillation)
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <defs>
          {/* Main gradient for the O */}
          <linearGradient id="deathlyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EADBC8" />
            <stop offset="50%" stopColor="#B99AFF" />
            <stop offset="100%" stopColor="#6AD1E3" />
          </linearGradient>

          {/* Triangle edge gradient */}
          <radialGradient id="triangleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B99AFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B99AFF" stopOpacity="0" />
          </radialGradient>

          {/* Vertical line luminous beam */}
          <linearGradient id="lineBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6AD1E3" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6AD1E3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6AD1E3" stopOpacity="0.8" />
          </linearGradient>

          {/* Inner glow circle */}
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6AD1E3" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#6AD1E3" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6AD1E3" stopOpacity="0" />
          </radialGradient>

          {/* Outer aura */}
          <radialGradient id="outerAura" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#EADBC8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EADBC8" stopOpacity="0" />
          </radialGradient>

          {/* Shimmer effect */}
          <radialGradient id="shimmer" cx="50%" cy="50%" r="30%">
            <stop offset="0%" stopColor="#EADBC8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#EADBC8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EADBC8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer aura halo */}
        <motion.circle
          cx="50"
          cy="50"
          r="60"
          fill="url(#outerAura)"
          animate={{
            r: [55, 65, 55],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main O circle - optically perfect */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#deathlyGradient)"
          strokeWidth="4"
          animate={{
            strokeWidth: [3.8, 4.2, 3.8], // Subtle breathing
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ strokeWidth: 4 }}
        />

        {/* Implied equilateral triangle - suggested through light gradients */}
        <motion.polygon
          points="50,11 72.5,69.5 27.5,69.5"
          fill="none"
          stroke="url(#triangleGlow)"
          strokeWidth="0.5"
          opacity="0.3"
          animate={{
            rotate: [0, 360], // Subtle gradient rotation
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Central vertical line - elder wand */}
        <motion.line
          x1="50"
          y1="11"
          x2="50"
          y2="89"
          stroke="url(#lineBeam)"
          strokeWidth="1"
          opacity="0.25"
          filter="blur(0.8px)" // Bloom effect
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner glow circle - resurrection stone */}
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          fill="url(#innerGlow)"
          animate={{
            opacity: [0.2, 0.45, 0.2], // Gentle pulse every 9 seconds
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Shimmer sweep effect */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="url(#shimmer)"
          animate={{
            cx: [30, 70, 30], // Light sweep across circumference
            cy: [30, 70, 30],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
