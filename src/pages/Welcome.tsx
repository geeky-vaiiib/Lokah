import { motion } from "framer-motion";
import LogoWordmark from "@/components/LogoWordmark";
import { GlassButton } from "@/components/GlassButton";

export default function Welcome() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-[#0B0C10] text-center font-[Inter]">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#0E1A2E] to-[#13213A]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/40 rounded-full"
            initial={{
              opacity: Math.random() * 0.5,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [Math.random() * 50, Math.random() * window.innerHeight],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div className="relative z-20 mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <LogoWordmark size={64} oScale={1.1} />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="z-20 text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#B693FF] via-[#A6CFFF] to-[#71D0E3] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Many Worlds, One You.
      </motion.p>

      {/* CTA */}
      <motion.div
        className="z-20 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <GlassButton
          label="Begin Your Journey"
          onClick={() => (window.location.href = "/onboarding")}
        />
      </motion.div>

      {/* Vignette & Bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(113,208,227,0.15)_0%,transparent_80%)] blur-3xl"></div>
    </div>
  );
}
