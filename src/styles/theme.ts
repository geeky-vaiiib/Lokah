export const LOKAH_THEME = {
  gradient: "linear-gradient(90deg, #c6b8ff 0%, #81e6ff 50%, #97ffe0 100%)",
  bg: "#0B0C10",
  glow: "drop-shadow(0 0 10px rgba(151,255,224,0.3))",
  ringGlow: "rgba(151,255,224,0.3)",
  accentA: "#c6b8ff",
  accentB: "#81e6ff",
  accentC: "#97ffe0"
};

export type LokahTone = "calm" | "warm" | "introspective" | "neutral";

export const toneGradients: Record<LokahTone, string> = {
  calm: "linear-gradient(135deg, #81e6ff 0%, #97ffe0 100%)",
  warm: "linear-gradient(135deg, #ffc78d 0%, #ffd5b5 100%)",
  introspective: "linear-gradient(135deg, #c6b8ff 0%, #9b8dff 100%)",
  neutral: "linear-gradient(135deg, #13213A 0%, #0B0C10 100%)"
};
