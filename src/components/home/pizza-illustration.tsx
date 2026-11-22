"use client";

import { motion, useReducedMotion } from "motion/react";

const pepperoni = [
  [150, 120], [255, 105], [330, 190], [95, 215], [210, 190], [300, 290],
  [140, 310], [230, 335], [205, 255], [345, 110],
] as const;
const olives = [[180, 150], [285, 235], [120, 270], [250, 150], [190, 305]] as const;
const basil = [[110, 160, -30], [310, 140, 40], [170, 235, 10], [260, 320, -50], [335, 250, 70]] as const;

export function PizzaIllustration({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 440 440"
      role="img"
      aria-label="Illustration of a freshly baked pepperoni pizza"
      className={className}
      animate={reduce ? undefined : { rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="220" cy="226" r="204" fill="#000" opacity="0.08" />
      <circle cx="220" cy="220" r="205" fill="#D9892F" />
      <circle cx="220" cy="220" r="205" fill="none" stroke="#B7501F" strokeWidth="8" opacity="0.55" />
      <circle cx="220" cy="220" r="178" fill="#C8281E" />
      <circle cx="220" cy="220" r="168" fill="#F6C456" />
      <circle cx="220" cy="220" r="168" fill="none" stroke="#F0A52E" strokeWidth="5" strokeDasharray="14 11" opacity="0.7" />
      {olives.map(([x, y], i) => (
        <g key={`o${i}`}>
          <circle cx={x} cy={y} r="11" fill="#2B2B2B" />
          <circle cx={x} cy={y} r="4.5" fill="#F6C456" />
        </g>
      ))}
      {pepperoni.map(([x, y], i) => (
        <g key={`p${i}`}>
          <circle cx={x} cy={y} r="25" fill="#B3171F" />
          <circle cx={x} cy={y} r="25" fill="none" stroke="#8E0F18" strokeWidth="3" />
          <circle cx={x - 7} cy={y - 6} r="3.5" fill="#D9473E" />
          <circle cx={x + 8} cy={y + 7} r="3" fill="#8E0F18" />
        </g>
      ))}
      {basil.map(([x, y, r], i) => (
        <ellipse key={`b${i}`} cx={x} cy={y} rx="17" ry="8" fill="#2F7D4F" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {[0, 45, 90, 135].map((deg) => (
        <line key={deg} x1="220" y1="52" x2="220" y2="388" stroke="#B7501F" strokeWidth="3" opacity="0.35" transform={`rotate(${deg} 220 220)`} />
      ))}
    </motion.svg>
  );
}
