"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective w-72 h-44 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-spring to-emerald-600 text-white flex items-center justify-center shadow-lg p-6">
          {front}
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-gold to-amber-500 text-charcoal flex items-center justify-center shadow-lg p-6">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
