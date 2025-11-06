import { motion } from "framer-motion";

export const MoodBackground = ({ toneTags = [] as string[] }) => {
  const toneMap: Record<string, string> = {
    calm: "from-[#71D0E3]/40 to-[#B693FF]/40",
    inspired: "from-[#B693FF]/30 to-[#FAD6E7]/30",
    reflective: "from-[#A1E0C0]/30 to-[#71D0E3]/30",
    warm: "from-[#FAD6E7]/40 to-[#B693FF]/40",
  };
  const gradient = (toneTags as string[])
    .map((tag) => toneMap[tag])
    .filter(Boolean)
    .join(" ") || "from-[#B693FF]/40 to-[#71D0E3]/40";

  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-1000 blur-3xl`}
      animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.02, 1] }}
      transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" as any }}
    />
  );
};

export default MoodBackground;