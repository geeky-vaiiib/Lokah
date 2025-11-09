import React from "react";
import { PortalO } from "@/components/PortalO";
import { LOKAH_THEME } from "@/styles/theme";

type Props = {
  size?: number; // letter height in px
  oScale?: number; // relative to letters
  className?: string;
  variant?: "hero" | "navbar" | "default";
};

export const LogoWordmark: React.FC<Props> = ({ size = 28, oScale = 1, className, variant = "default" }) => {
  const presets = {
    hero: { letter: 96, o: 1.2 },
    navbar: { letter: 42, o: 1.15 },
    default: { letter: size, o: oScale },
  } as const;
  const preset = presets[variant] ?? presets.default;
  const letterSize = preset.letter;
  // Match O exactly to letter height (no overscale) for visual balance
  const oSize = Math.round(letterSize * 0.88); // slightly smaller for balance
  return (
    <div
      className={`logo-container relative flex items-baseline justify-center gap-2 font-[ClashDisplay] uppercase ${className ?? ""}`}
      style={{ lineHeight: 1, letterSpacing: '0.1em', background: variant === 'hero' ? LOKAH_THEME.gradient : undefined, WebkitBackgroundClip: variant === 'hero' ? 'text' : undefined, color: variant === 'hero' ? 'transparent' : '#FFFFFF' }}
    >
      <span style={{ fontSize: letterSize }}>L</span>
      <div className="relative flex items-center justify-center" style={{ height: letterSize }}>
        {/* unified theme glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(198,184,255,0.18), rgba(129,230,255,0))`,
            filter: LOKAH_THEME.glow,
          }}
        />
        <PortalO size={oSize} strokeWidth={1.2} subtle={variant !== "hero"} diagonal />
      </div>
      <span style={{ fontSize: letterSize }}>KAH</span>
    </div>
  );
};

export default LogoWordmark;
