import React from "react";
import { PortalO } from "@/components/PortalO";

type Props = {
  size?: number; // font size in px for letters
  oScale?: number; // relative scale for the PortalO vs letters
  className?: string;
};

/**
 * LogoWordmark — renders L [PortalO] KAH with precise alignment.
 * Uses flexbox centering so the "O" is positioned perfectly between L and KAH.
 */
export const LogoWordmark: React.FC<Props> = ({ size = 28, oScale = 1, className }) => {
  const oSize = Math.round(size * 1.2 * oScale); // base PortalO size
  const letterSize = oSize; // match letters visually to the O size
  return (
    <div
      className={`logo-container flex items-center justify-center gap-2 text-white font-[ClashDisplay] tracking-[0.25em] ${
        className ?? ""
      }`}
      style={{ lineHeight: 1 }}
    >
      <span style={{ fontSize: letterSize }}>L</span>
      <div className="flex items-center justify-center" style={{ height: letterSize }}>
        <PortalO size={oSize} strokeWidth={1.2} />
      </div>
      <span style={{ fontSize: letterSize }}>KAH</span>
    </div>
  );
};

export default LogoWordmark;
