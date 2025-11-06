import { motion } from 'framer-motion';

interface InfinitySymbolProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InfinitySymbol({ size = 'md', className = '' }: InfinitySymbolProps) {
  const sizeMap = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} ${className} relative`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: [0, 360]
      }}
      transition={{
        duration: 1,
        ease: 'easeOut',
        rotateY: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }
      }}
    >
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EADBC8" />
            <stop offset="33%" stopColor="#B99AFF" />
            <stop offset="66%" stopColor="#6AD1E3" />
            <stop offset="100%" stopColor="#EADBC8" />
          </linearGradient>
          <filter id="dnaGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="etherealTrail">
            <feGaussianBlur stdDeviation="8" result="trail"/>
            <feColorMatrix
              in="trail"
              type="matrix"
              values="1 0 0 0 0.9  0 1 0 0 0.6  0 0 1 0 0.8  0 0 0 0.3 0"
            />
          </filter>
        </defs>

        {/* DNA Helix Structure - Two intertwined spirals */}
        <motion.path
          d="M 15,25 Q 25,15 40,20 Q 55,25 70,15 Q 85,5 100,20"
          stroke="url(#dnaGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#dnaGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        <motion.path
          d="M 15,35 Q 25,45 40,40 Q 55,35 70,45 Q 85,55 100,40"
          stroke="url(#dnaGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#dnaGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
        />

        {/* Connecting rungs of the DNA */}
        <motion.line
          x1="25" y1="20" x2="25" y2="40"
          stroke="url(#dnaGradient)"
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        />

        <motion.line
          x1="40" y1="25" x2="40" y2="35"
          stroke="url(#dnaGradient)"
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />

        <motion.line
          x1="55" y1="20" x2="55" y2="40"
          stroke="url(#dnaGradient)"
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        />

        <motion.line
          x1="70" y1="25" x2="70" y2="35"
          stroke="url(#dnaGradient)"
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        />

        <motion.line
          x1="85" y1="15" x2="85" y2="45"
          stroke="url(#dnaGradient)"
          strokeWidth="1.5"
          opacity="0.7"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        />

        {/* Consciousness nodes orbiting the structure */}
        <motion.circle
          cx="25" cy="20"
          r="2.5"
          fill="#6AD1E3"
          opacity="0.9"
          filter="url(#dnaGlow)"
          animate={{
            cx: [25, 30, 25],
            cy: [20, 15, 20],
            opacity: [0.9, 0.6, 0.9]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.circle
          cx="40" cy="35"
          r="2"
          fill="#B99AFF"
          opacity="0.8"
          filter="url(#dnaGlow)"
          animate={{
            cx: [40, 45, 40],
            cy: [35, 40, 35],
            opacity: [0.8, 0.5, 0.8]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.circle
          cx="55" cy="20"
          r="2.5"
          fill="#EADBC8"
          opacity="0.9"
          filter="url(#dnaGlow)"
          animate={{
            cx: [55, 60, 55],
            cy: [20, 15, 20],
            opacity: [0.9, 0.6, 0.9]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        <motion.circle
          cx="70" cy="35"
          r="2"
          fill="#6AD1E3"
          opacity="0.8"
          filter="url(#dnaGlow)"
          animate={{
            cx: [70, 75, 70],
            cy: [35, 40, 35],
            opacity: [0.8, 0.5, 0.8]
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />

        <motion.circle
          cx="85" cy="20"
          r="2.5"
          fill="#B99AFF"
          opacity="0.9"
          filter="url(#dnaGlow)"
          animate={{
            cx: [85, 90, 85],
            cy: [20, 15, 20],
            opacity: [0.9, 0.6, 0.9]
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Ethereal trail effect */}
        <motion.path
          d="M 15,25 Q 25,15 40,20 Q 55,25 70,15 Q 85,5 100,20"
          stroke="url(#dnaGradient)"
          strokeWidth="8"
          fill="none"
          filter="url(#etherealTrail)"
          opacity="0.3"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            pathLength: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
}
