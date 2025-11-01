import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ReflectionCardProps {
  reflection: {
    title: string;
    insights: string[];
    emotional_tone: string;
  };
}

export const ReflectionCard = ({ reflection }: ReflectionCardProps) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 rounded-xl glass-card border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          </motion.div>
          <h3 className="font-semibold text-xl">{reflection.title}</h3>
        </div>
        
        <ul className="space-y-3">
          {reflection.insights.map((insight: string, index: number) => (
            <motion.li 
              key={index} 
              className="flex items-start gap-3 text-sm leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
              <span>{insight}</span>
            </motion.li>
          ))}
        </ul>
        
        {reflection.emotional_tone && (
          <div className="mt-6 pt-4 border-t border-primary/10">
            <p className="text-sm text-muted-foreground italic">
              Emotional tone: <span className="text-foreground font-medium">{reflection.emotional_tone}</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
