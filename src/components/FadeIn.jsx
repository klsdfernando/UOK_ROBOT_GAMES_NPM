"use client";

import { motion } from "framer-motion";

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  direction = "up",
  distance = 40,
  once = true,
  viewAmount = 0.2,
}) {
  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
        filter: "blur(4px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: once, amount: viewAmount }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier (same as our CSS animation)
      }}
    >
      {children}
    </motion.div>
  );
}
