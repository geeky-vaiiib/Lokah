import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MemorySnippetBadgeProps {
  text: string;
  emotionalTone?: string;
}

export const MemorySnippetBadge = ({ text, emotionalTone }: MemorySnippetBadgeProps) => {
  return (
    <motion.div 
      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="h-3 w-3" />
      </motion.div>
      <span className="italic">"{text}"</span>
      {emotionalTone && (
        <span className="ml-1 opacity-70">· {emotionalTone}</span>
      )}
    </motion.div>
  );
};
