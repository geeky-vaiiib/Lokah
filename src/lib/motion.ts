export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  glowHover: {
    whileHover: { scale: 1.02, boxShadow: "0 0 20px rgba(113,208,227,0.3)" },
    whileTap: { scale: 0.97 },
  },
  portalRotation: {
    animate: { rotate: 360 },
  transition: { repeat: Infinity as any, duration: 10, ease: [0.0, 0.0, 1.0, 1.0] as any },
  },
  buttonHover: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as any },
};

export const slowFloat = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as any },
};

export type ToneTag = "calm" | "warm" | "reflective" | "inspired" | "practical" | "anxious" | string;

export function toneToGradient(tone: ToneTag | ToneTag[] | undefined): string {
  const t = Array.isArray(tone) ? tone[0] : tone;
  switch (t) {
    case "calm":
      return "from-[#71D0E3] to-[#A1E0C0]"; // blue-mint
    case "warm":
      return "from-[#FAD6E7] to-[#B693FF]"; // rose-lavender
    case "reflective":
      return "from-[#B693FF] to-[#71D0E3]"; // mirror spectrum
    case "inspired":
      return "from-[#B693FF] to-[#FAD6E7]"; // violet-rose
    case "practical":
      return "from-[#BFC6D0] to-[#A1E0C0]"; // neutral-mint
    case "anxious":
      return "from-[#71D0E3] to-[#0B0C10]"; // cool to deep
    default:
      return "from-[#B693FF] to-[#71D0E3]";
  }
}
