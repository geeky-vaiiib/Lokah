export const LokahBrand = {
  gradient: "linear-gradient(90deg,#B693FF 0%,#71D0E3 100%)",
  glow: "0 0 25px rgba(113,208,227,0.25)",
  colors: {
    bgDark: "#0B0C10",
    bgMid: "#0E1A2E",
    bgTop: "#13213A",
    accentCyan: "#71D0E3",
    accentLavender: "#B693FF",
    textPrimary: "#F5F7FA",
    textMuted: "#A6CFFF",
  },
  gradients: {
    primary: "linear-gradient(90deg, #B693FF 0%, #71D0E3 100%)",
    soft: "linear-gradient(180deg, rgba(182,147,255,0.2) 0%, rgba(113,208,227,0.2) 100%)",
    glow: "0 0 25px rgba(113,208,227,0.25)",
  },
  fonts: {
    display: "Clash Display",
    heading: "Clash Display",
    body: "Inter",
  },
  motion: {
    fadeIn: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" },
    },
    glowHover: {
      whileHover: { scale: 1.02, boxShadow: "0 0 20px rgba(113,208,227,0.3)" },
      whileTap: { scale: 0.97 },
    },
  },
} as const;

export type LokahBrandType = typeof LokahBrand;
