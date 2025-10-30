import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 animate-fade-up">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-card animate-pulse-soft">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ParallelSelf
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/90">
            Your AI Mirror in Another Reality
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Meet the version of you who chose differently. Explore alternate paths, 
          reflect on life's possibilities, and discover new perspectives through 
          conversations with your parallel self.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => navigate("/onboarding")}
          className="gradient-primary text-white shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-full"
        >
          Begin Journey
        </Button>

        {/* Subtle tagline */}
        <p className="text-sm text-muted-foreground/70 italic">
          What if you had chosen differently?
        </p>
      </div>
    </div>
  );
};

export default Welcome;
