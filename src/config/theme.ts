// Global Lokah theme tokens and helpers
export const theme = {
  colors: {
    bg: {
      base: "#0B0C10",
      mid: "#0E1A2E",
      top: "#13213A",
    },
    gradientPrimary: "linear-gradient(90deg, #B693FF 0%, #71D0E3 100%)",
    gradientSecondary: "linear-gradient(90deg, #FAD6E7 0%, #A1E0C0 100%)",
    text: { primary: "#FFFFFF", secondary: "#BFC6D0" },
    accentGlow: "#D1A9FF",
  },
  tracking: {
    logo: "0.08em",
    heading: "0.1em",
    button: "0.05em",
  },
};

export type Theme = typeof theme;
