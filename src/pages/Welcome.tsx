import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/Logo";
import { CosmicButton } from "@/components/CosmicButton";
import { MultiverseBackground } from "@/components/MultiverseBackground";
import { Holocard } from "@/components/Holocard";

export default function Welcome() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div className="relative min-h-screen overflow-hidden font-[Outfit] selection:bg-[hsl(35_35%_65%/0.3)] selection:text-white bg-[hsl(30 15% 6%)] text-left">

      {/* Global Effects */}
      <div className="scanlines" />
      <MultiverseBackground />

      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(35 35% 65% / 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(35 35% 65% / 0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header (Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-12">
        <motion.div
          className="absolute inset-0 -z-10 transition-all duration-300"
          style={{
            background: 'hsl(30 15% 6% / 0.5)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.04)',
          }}
        />

        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-[hsl(35_35%_65%)]"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/50 text-[11px] tracking-[0.2em] font-medium uppercase">
            Lokah Protocol
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.2em] text-white/40 uppercase">
          <a href="#" className="hover:text-white transition-colors duration-300 relative group">
            Manifesto
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(35_35%_65%)] group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300 relative group">
            Technology
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(35_35%_65%)] group-hover:w-full transition-all duration-300" />
          </a>
          <a href="/auth" className="hover:text-white transition-colors duration-300 relative group">
            Login
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(35_35%_65%)] group-hover:w-full transition-all duration-300" />
          </a>
        </nav>
      </header>

      {/* Main Hero Content */}
      <motion.main
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center px-8 md:px-20 pt-24"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {/* Left Column: Typography & Action */}
        <motion.div
          className="flex flex-col items-start gap-8 max-w-2xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)] animate-pulse" />
            <span className="text-[hsl(35_35%_65%)] font-mono text-[10px] tracking-[0.2em] uppercase">
              System Verified • Identity Layer v2.0
            </span>
          </motion.div>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <motion.h1
              className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 50%, hsl(25 55% 50%) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 4s linear infinite',
                }}
              >
                LOKAH
              </span>
              <br />
              <span className="text-white/90 text-4xl md:text-5xl mt-2 block">
                Many Worlds, One You
              </span>
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl font-light text-white/50 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Transcending singular existence. Verify your multiverse presence and synchronize your digital soul across all dimensions.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <CosmicButton
              label="Initialize Sequence"
              onClick={() => (window.location.href = "/onboarding")}
            />
            <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-mono">
              / Access Granted
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Anchor */}
        <motion.div
          className="relative flex items-center justify-center h-full lg:h-auto mt-16 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <Holocard intensity={25} className="relative z-20">
            <div className="relative p-20">
              {/* Orbital Rings */}
              <motion.div
                className="absolute inset-0 border border-white/[0.04] rounded-full"
                style={{ scale: 1.6 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 border border-[hsl(35_35%_65%/0.1)] rounded-full"
                style={{ scale: 1.3, rotate: 45 }}
                animate={{ rotate: -270 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo with Glow */}
              <div className="relative">
                <Logo
                  size={160}
                  variant="icon"
                  className="relative z-10"
                />
                <div
                  className="absolute inset-0 blur-3xl opacity-40"
                  style={{
                    background: 'radial-gradient(circle, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 50%, transparent 70%)',
                  }}
                />
              </div>

              {/* Floating Data Points */}
              <motion.div
                className="absolute -right-16 top-4 text-[9px] font-mono text-[hsl(35_35%_65%/0.8)] bg-[hsl(30 15% 6%)]/80 px-3 py-1.5 border border-[hsl(35_35%_65%/0.2)] backdrop-blur-md rounded-sm"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                COORD: 88.291.X
              </motion.div>

              <motion.div
                className="absolute -left-12 bottom-8 text-[9px] font-mono text-[hsl(35_35%_65%/0.8)] bg-[hsl(30 15% 6%)]/80 px-3 py-1.5 border border-[hsl(35_35%_65%/0.2)] backdrop-blur-md rounded-sm"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                SYNC: ACTIVE
              </motion.div>
            </div>
          </Holocard>
        </motion.div>
      </motion.main>

      {/* Status Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end text-[9px] tracking-[0.2em] text-white/15 uppercase z-10">
        <div className="flex flex-col gap-1">
          <span>Node: Tokyo-03</span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-green-500/50" />
            Latency: 2ms
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>Lokah Systems Inc.</span>
          <span>© 2024 All Rights Reserved</span>
        </div>
      </footer>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(35 35% 65% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(35 35% 65% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
