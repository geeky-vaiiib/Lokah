import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/GlassButton";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[hsl(220 25% 4%)] font-[Outfit]">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 30%, hsl(35 35% 65% / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 50% 70%, hsl(35 35% 65% / 0.08) 0%, transparent 50%),
            hsl(222 47% 3%)
          `,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: i % 2 === 0 ? 'hsl(35 35% 65%)' : 'hsl(35 35% 65%)',
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Logo size={56} variant="icon" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          className="text-8xl md:text-9xl font-['Clash_Display'] font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-xl text-white/50 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Lost in the Multiverse
        </motion.p>

        <motion.p
          className="text-white/30 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The reality you're looking for doesn't exist in this dimension.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassButton
            label="Return to Origin"
            onClick={() => navigate("/")}
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 text-[10px] text-white/15 tracking-[0.15em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Lokah • Many Worlds, One You
      </motion.p>
    </div>
  );
};

export default NotFound;
