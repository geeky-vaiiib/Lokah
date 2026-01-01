import React from "react";
import { LokahIcon } from "./LokahIcon";
import { Link } from "react-router-dom";

export interface LogoProps {
  variant?: "default" | "icon" | "wordmark" | "hero";
  size?: number; // Size of the icon or text height
  className?: string;
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = 32,
  className = "",
  asLink = false
}) => {
  // Size calculations
  const iconSize = variant === "hero" ? size * 1.5 : size;
  const textSize = size;

  const Content = () => (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Section */}
      {(variant === "default" || variant === "icon" || variant === "hero") && (
        <LokahIcon size={iconSize} animated={true} />
      )}

      {/* Wordmark Section */}
      {(variant === "default" || variant === "wordmark" || variant === "hero") && (
        <div
          className="flex flex-col leading-none"
          style={{
            fontFamily: '"Clash Display", sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          <span
            className="font-semibold uppercase text-white tracking-widest"
            style={{ fontSize: textSize }}
          >
            Lokah
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="hover:opacity-90 transition-opacity">
        <Content />
      </Link>
    );
  }

  return <Content />;
};

export default Logo;
