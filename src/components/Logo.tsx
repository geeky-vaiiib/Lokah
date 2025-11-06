import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'wordmark' | 'symbol' | 'wordmark-portal';
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function Logo({
  variant = 'wordmark',
  size = 48,
  animated = false,
  className = ''
}: LogoProps) {
  // variants: 'wordmark', 'symbol', 'wordmark-portal'
  if (variant === 'symbol') {
    return (
      <img
        src={animated ? '/lokah-symbol-anim.svg' : '/lokah-symbol-plain.svg'}
        alt="Lokah symbol"
        width={size}
        height={size}
        className={`${styles.symbol} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'wordmark-portal') {
    return (
      <img
        src="/lokah-wordmark-portal.svg"
        alt="Lokah"
        width={size * 4}
        height={size}
        className={`${styles.wordmark} ${className}`}
      />
    );
  }

  return (
    <img
      src="/lokah-wordmark.png"
      alt="Lokah - Many Worlds, One You"
      width={size * 4}
      height={size}
      className={`${styles.wordmark} ${className}`}
    />
  );
}
