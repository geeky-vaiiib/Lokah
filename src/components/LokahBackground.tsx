import { motion } from "framer-motion";
import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const LokahBackground: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B0C10] via-[#0E1A2E] to-[#13213A]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(113,208,227,0.12)_0%,transparent_80%)] blur-3xl" />
      {children}
    </div>
  );
};

export default LokahBackground;
