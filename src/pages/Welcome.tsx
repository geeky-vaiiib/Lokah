import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { MotionWrapper } from "@/components/MotionWrapper";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, Users, MessageCircle, Share2 } from "lucide-react";
import heroBg from "@/assets/lokah-hero-bg.png";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/saved");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated overlay elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <MotionWrapper animation="fadeUp" delay={0} className="text-center space-y-6">
            <Logo variant="stacked" size="lg" animated />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Discover Your
              <span className="block gradient-text mt-2">Parallel Self</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet the version of you who chose differently. Explore alternate paths and gain profound insights through meaningful AI conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="gradient-primary text-white text-lg px-8 py-6 rounded-full shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
            </div>
          </MotionWrapper>

          {/* Features Grid */}
          <MotionWrapper animation="fadeUp" delay={0.2} className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="glass-card p-6 rounded-2xl text-center space-y-3 transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Create Parallel Selves</h3>
              <p className="text-muted-foreground text-sm">
                Generate alternate versions based on different life choices, exploring paths not taken
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl text-center space-y-3 transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Deep Conversations</h3>
              <p className="text-muted-foreground text-sm">
                Engage in meaningful dialogues that reveal insights about your choices and values
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl text-center space-y-3 transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Share Wisdom</h3>
              <p className="text-muted-foreground text-sm">
                Capture and share profound reflections and insights from your parallel self conversations
              </p>
            </div>
          </MotionWrapper>

          {/* CTA Section */}
          <MotionWrapper animation="fadeUp" delay={0.4} className="text-center space-y-4 pt-8">
            <p className="text-lg text-muted-foreground">
              Every choice births another you
            </p>
            <p className="text-sm text-muted-foreground/60 max-w-2xl mx-auto">
              Lokah creates safe, emotionally intelligent spaces for self-reflection and growth.
              Your conversations are private, your insights are yours to keep and share as you choose.
            </p>
          </MotionWrapper>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center space-y-2">
        <p className="text-muted-foreground/80 italic">
          LO◯KAH — In stillness, you find your parallel self.
        </p>
        <Button
          variant="link"
          onClick={() => navigate("/about")}
          className="text-muted-foreground/60 hover:text-primary transition-colors text-sm"
        >
          Learn about our philosophy
        </Button>
      </footer>
    </div>
  );
};

export default Welcome;
