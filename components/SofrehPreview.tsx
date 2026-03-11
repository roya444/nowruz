"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sofrehItems } from "@/data/items";
import { UserSelection } from "@/lib/types";

interface SofrehPreviewProps {
  selections: UserSelection[];
}

// Percentage-based positions for all 12 items
const positions: { top: string; left: string }[] = [
  // Core 7 in a circular pattern
  { top: "8%", left: "50%" },
  { top: "25%", left: "20%" },
  { top: "25%", left: "80%" },
  { top: "48%", left: "10%" },
  { top: "48%", left: "90%" },
  { top: "68%", left: "22%" },
  { top: "68%", left: "78%" },
  // Additional 5
  { top: "38%", left: "50%" },
  { top: "85%", left: "35%" },
  { top: "85%", left: "65%" },
  { top: "58%", left: "50%" },
  { top: "92%", left: "50%" },
];

export default function SofrehPreview({ selections }: SofrehPreviewProps) {
  const getVariant = (sel: UserSelection) => {
    const item = sofrehItems.find((i) => i.id === sel.itemId);
    const variant = item?.variants.find((v) => v.id === sel.variantId);
    return { item, variant };
  };

  // Map item id to its position index
  const itemIndexMap = new Map(sofrehItems.map((item, idx) => [item.id, idx]));

  return (
    <div className="bg-[#898989] rounded-[24px] p-6 flex items-center justify-center">
      <div
        className="relative w-full rounded-full border-4 border-gold shadow-xl overflow-hidden"
        style={{
          paddingBottom: "100%", // 1:1 aspect ratio
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 70%),
            repeating-conic-gradient(from 0deg, rgba(76,175,80,0.03) 0deg 30deg, transparent 30deg 60deg)
          `,
          background:
            "linear-gradient(135deg, #FFFDE7 0%, #FFF3E0 50%, #FCE4EC 100%)",
        }}
      >
        {/* Decorative borders */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-200" />
        <div className="absolute inset-4 rounded-full border border-amber-100" />

        {/* Center decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20 pointer-events-none">
          <p className="text-4xl md:text-6xl">🌿</p>
        </div>

        {/* Placeholder circles for unselected core items */}
        {sofrehItems
          .filter((item) => item.isCore)
          .map((item) => {
            const idx = itemIndexMap.get(item.id)!;
            const pos = positions[idx];
            const isSelected = selections.some((s) => s.itemId === item.id);
            if (isSelected) return null;

            return (
              <div
                key={`placeholder-${item.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-dashed border-amber-200/50 flex items-center justify-center">
                  <span className="text-lg md:text-xl opacity-30">
                    {item.variants[0].emoji}
                  </span>
                </div>
              </div>
            );
          })}

        {/* Selected items with animation */}
        <AnimatePresence>
          {selections.map((sel) => {
            const { item, variant } = getVariant(sel);
            if (!item || !variant) return null;
            const idx = itemIndexMap.get(sel.itemId)!;
            const pos = positions[idx];

            return (
              <motion.div
                key={sel.itemId}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-2 py-1.5 md:px-3 md:py-2 shadow-lg text-center border border-amber-100">
                  <span className="text-xl md:text-3xl block">
                    {variant.emoji}
                  </span>
                  <p className="text-[9px] md:text-xs font-semibold text-[#333] mt-0.5">
                    {item.phoneticName}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-gray-500">
                    {variant.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
