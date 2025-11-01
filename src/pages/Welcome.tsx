import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { MotionWrapper } from "@/components/MotionWrapper";
import heroBackground from "@/assets/hero-background.png";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Hero background */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
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
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        <MotionWrapper animation="scale" delay={0.1}>
          <Logo variant="stacked" size="lg" animated />
        </MotionWrapper>
        
        <MotionWrapper animation="fadeUp" delay={0.3}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold gradient-text leading-tight">
            Step Through the Mirror
          </h1>
        </MotionWrapper>
        
        <MotionWrapper animation="fadeUp" delay={0.5}>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Meet the version of you who chose differently
          </p>
        </MotionWrapper>

        <MotionWrapper animation="fadeUp" delay={0.7}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="gradient-primary text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-card hover:shadow-elevated transition-all hover:scale-105"
            >
              Enter the Multiverse
            </Button>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fade" delay={0.9}>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground/80 italic pt-8 leading-relaxed">
            What would you have become if you had chosen a different path?<br />
            Who would you be if that one moment had gone differently?
          </p>
        </MotionWrapper>
      </div>
    </div>
  );
};

export default Welcome;
