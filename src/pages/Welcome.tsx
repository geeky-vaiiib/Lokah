import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/saved");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-3xl animate-fade-up">
        {/* Logo */}
        <div className="mb-8 animate-scale-in">
          <img src={logo} alt="ParallelSelf" className="h-24 mx-auto" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in gradient-text">
          Step Through the Mirror
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
          Meet the versions of you from parallel realities.<br />
          Explore the choices you didn't make.<br />
          Discover the lives you didn't live.
        </p>

        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="gradient-primary text-white text-lg px-8 py-6 hover:scale-105 transition-transform"
          >
            Enter the Multiverse
          </Button>
        </div>

        <div className="mt-12 space-y-2 text-sm text-muted-foreground/80 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p className="italic">What if you had chosen differently?</p>
          <p className="italic">What if you had taken that other path?</p>
          <p className="italic">What would your life look like... in another reality?</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
