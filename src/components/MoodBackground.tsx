import { motion } from "framer-motion";

interface MoodBackgroundProps { toneTags?: string[] }

const toneToGradient: Record<string, string> = {
  friendly: "linear-gradient(120deg, #81e6ff, #97ffe0)",
  calm: "linear-gradient(120deg, #97ffe0, #c6b8ff)",
  introspective: "linear-gradient(120deg, #c6b8ff, #81e6ff)",
};

export const MoodBackground: React.FC<MoodBackgroundProps> = ({ toneTags = [] }) => {
  const activeTone = toneTags[0] || 'friendly';
  const bg = toneToGradient[activeTone] || toneToGradient.friendly;
  return (
    <motion.div
      animate={{ background: bg }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      className="fixed inset-0 -z-10"
    >
      <canvas id="particles" className="absolute inset-0 opacity-10" />
    </motion.div>
  );
};

export default MoodBackground;