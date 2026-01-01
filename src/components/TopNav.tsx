import { GlassButton } from "@/components/GlassButton";
import Logo from "@/components/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const TopNav: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Transform scroll position to background opacity
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0.02, 0.1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      className={`w-full fixed top-0 left-0 z-50 ${className ?? ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glass Background with scroll-aware opacity */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: `hsl(222 47% 3% / ${isScrolled ? 0.85 : 0.4})`,
          backdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
          borderBottom: `1px solid hsl(0 0% 100% / ${isScrolled ? 0.08 : 0.03})`,
          boxShadow: isScrolled ? '0 4px 30px -10px hsl(0 0% 0% / 0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}
      />

      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        {/* Left: Logo & Status */}
        <div className="flex items-center gap-4">
          <Logo size={26} asLink />

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)]"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-medium">
              Online
            </span>
          </div>
        </div>

        {/* Right: Navigation Actions */}
        <nav className="flex items-center gap-2">
          <GlassButton
            variant="ghost"
            onClick={() => navigate("/saved")}
            label="My Selves"
            size="sm"
            className={`
              text-xs tracking-wide
              ${isActive('/saved')
                ? 'text-white bg-white/[0.06]'
                : 'text-white/60 hover:text-white'
              }
            `}
          />

          <div className="w-px h-5 bg-white/[0.08] mx-1 hidden sm:block" />

          <GlassButton
            variant="primary"
            onClick={() => navigate("/generator")}
            label="+ Create New"
            size="sm"
            className="text-xs font-medium"
          />
        </nav>
      </div>

      {/* Subtle gradient line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(35 35% 65% / 0.3), hsl(42 100% 55% / 0.2), transparent)',
        }}
      />
    </motion.header>
  );
};

export default TopNav;
