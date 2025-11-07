import { motion } from "framer-motion";

interface MoodBackgroundProps {
  toneTags?: string[];
}

export const MoodBackground: React.FC<MoodBackgroundProps> = ({ toneTags = [] }) => {
  const toneMap: Record<string, { grad: string; orb: string }> = {
    calm: { grad: "from-[#71D0E3]/35 to-[#B693FF]/35", orb: "bg-[#71D0E3]/10" },
    warm: { grad: "from-[#FAD6E7]/30 to-[#B693FF]/30", orb: "bg-[#FAD6E7]/10" },
    reflective: { grad: "from-[#B693FF]/30 to-[#71D0E3]/30", orb: "bg-[#B693FF]/10" },
    practical: { grad: "from-[#BFC6D0]/25 to-[#A1E0C0]/25", orb: "bg-[#A1E0C0]/10" },
    inspired: { grad: "from-[#B693FF]/30 to-[#FAD6E7]/30", orb: "bg-[#B693FF]/10" },
  };
  const primary = toneMap[toneTags[0] as string] || toneMap.reflective;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Slow shifting gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${primary.grad} blur-3xl`}
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.02, 1] }}
  transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* Ambient moving orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${primary.orb}`}
          style={{
            width: 140 + (i % 3) * 40,
            height: 140 + (i % 3) * 40,
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            filter: "blur(16px)",
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            y: [0, (i % 2 === 0 ? -20 : 20), 0],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{ duration: 20 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

export default MoodBackground;