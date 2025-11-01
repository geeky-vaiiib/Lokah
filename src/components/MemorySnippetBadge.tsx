import { Sparkles } from "lucide-react";

interface MemorySnippetBadgeProps {
  text: string;
  emotionalTone?: string;
}

export const MemorySnippetBadge = ({ text, emotionalTone }: MemorySnippetBadgeProps) => {
  return (
    <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs animate-fade-in">
      <Sparkles className="h-3 w-3 text-primary" />
      <span className="text-foreground/70 italic">"{text}"</span>
      {emotionalTone && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
          {emotionalTone}
        </span>
      )}
    </div>
  );
};
