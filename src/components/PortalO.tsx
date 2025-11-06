import { motion } from "framer-motion";

export function PortalO({ size = 48, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Soft radial glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(182,147,255,0.15)_0%,transparent_70%)]" />
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear" as any, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="absolute rounded-full border border-[#71D0E3]/60 shadow-[0_0_20px_rgba(113,208,227,0.25)]"
          style={{ width: size, height: size }}
        />
        <div
          className="absolute inset-x-[48%] bg-[#71D0E3]/70 blur-[0.5px]"
          style={{
            height: size * 0.8,
            width: strokeWidth,
            borderRadius: "1px",
          }}
        />
      </motion.div>
    </div>
  );
}

export default PortalO;