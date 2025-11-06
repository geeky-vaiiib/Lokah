import { motion } from "framer-motion";

export default function LogoLokah({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`lokah-logo relative z-50 flex items-center justify-center select-none ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      aria-label="LOKAH logo"
    >
      <div className="lokah-wordmark text-[4.5rem] font-cinzel font-medium tracking-[0.08em] flex items-center justify-center">
        <span className="lokah-l">L</span>
        <span className="lokah-o relative inline-flex items-center justify-center mx-[0.5rem]">
          <span className="lokah-ring absolute inset-0"></span>
          <span className="lokah-core"></span>
        </span>
        <span className="lokah-rest">KAH</span>
      </div>

      {/* Subtle glow behind the logo */}
      <div className="absolute inset-0 m-auto w-[280px] h-[280px] rounded-full bg-radial-[circle,rgba(140,255,255,0.08),transparent_75%] -z-10"></div>
    </motion.div>
  );
}
