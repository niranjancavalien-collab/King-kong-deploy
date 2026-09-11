import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

/**
 * Viewport-triggered fade + rise, used for one-time content reveals.
 * Fires once, a bit before the element is fully in view, so it never
 * feels like it's racing the user's scroll.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  duration = 0.9,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
