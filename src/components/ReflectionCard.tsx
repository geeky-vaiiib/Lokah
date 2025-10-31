import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ReflectionCardProps {
  reflection: {
    title: string;
    insights: string[];
    emotional_tone: string;
  };
}

export const ReflectionCard = ({ reflection }: ReflectionCardProps) => {
  return (
    <Card className="p-6 glass-card border-primary/30 animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold gradient-text">{reflection.title}</h3>
      </div>
      
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-accent text-white capitalize">
          {reflection.emotional_tone}
        </span>
      </div>

      <div className="space-y-3">
        {reflection.insights.map((insight, index) => (
          <div key={index} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-sm text-foreground/80">{insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};