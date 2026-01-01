import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/saved");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[hsl(220 25% 4%)]">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, hsl(35 35% 65% / 0.08) 0%, transparent 50%),
            hsl(222 47% 3%)
          `,
        }}
      />

      {/* Loading Content */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={48} variant="icon" className="animate-pulse" />

        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[hsl(35_35%_65%)]" />
          <span className="text-white/40 text-sm tracking-wide">Synchronizing dimensions...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
