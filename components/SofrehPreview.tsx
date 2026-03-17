"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sofrehItems } from "@/data/items";
import { UserSelection } from "@/lib/types";

interface SofrehPreviewProps {
  selections: UserSelection[];
}

// Map variant IDs to SVG illustration paths
const variantSvgMap: Record<string, string> = {
  "sonbol-purple": "/hyacinth-blue.svg",
  "sonbol-pink": "/hyacinth-pink.svg",
  "sonbol-yellow": "/hyacinth-yellow.svg",
  "sabzeh-wheat": "/sabzeh-wheatgrass.svg",
  "sabzeh-lentil": "/sabzeh-lentil.svg",
  "sabzeh-mungbean": "/sabzeh-mungbean.svg",
  "sib-red": "/apple-red.svg",
  "sib-green": "/apple-green.svg",
  "sib-golden": "/apple-golden.svg",
  "sir-white": "/garlic-white.svg",
  "sir-purple": "/garlic-purple.svg",
  "sekkeh-gold": "/coins-gold.svg",
  "sekkeh-silver": "/coins-silver.svg",
  "sekkeh-mixed": "/coins-mixed.svg",
  "goldfish-orange": "/fish-orange.svg",
  "goldfish-red": "/fish-red.svg",
  "goldfish-yellow": "/fish-yellow.svg",
};

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
  // Additional 6: sonbol, sekkeh, shirini, goldfish, tokhmeh, ayeneh
  { top: "30%", left: "78%" },
  { top: "85%", left: "35%" },
  { top: "85%", left: "65%" },
  { top: "58%", left: "50%" },
  { top: "75%", left: "50%" },
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
    <div
      className="relative w-full rounded-[25px] overflow-hidden"
      style={{ paddingBottom: "75%" }}
    >
      {/* Cream top area */}
      <div className="absolute inset-0 bg-[#fffbf1]" />

      {/* Blue mosaic bottom area with curved top edge */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "58%",
          borderRadius: "50% 50% 0 0 / 60px 60px 0 0",
          backgroundColor: "#0F4637",
          backgroundImage: "url('/mosaic-tile-combined.svg')",
          backgroundSize: "342px 174px",
          backgroundRepeat: "repeat",
        }}
      />

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

          const svgPath = variantSvgMap[variant.id];

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
              {svgPath ? (
                <div className={`relative ${item.id === "goldfish" ? "w-24 h-28 md:w-36 md:h-40" : "w-20 h-24 md:w-28 md:h-36"}`}>
                  {item.id === "goldfish" && (
                    <img
                      src="/fishbowl-empty.svg"
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  )}
                  <img
                    src={svgPath}
                    alt={`${item.englishName} - ${variant.label}`}
                    className={`relative object-contain drop-shadow-md ${
                      item.id === "goldfish"
                        ? "absolute top-[30%] left-[15%] w-[55%] h-[40%]"
                        : "w-full h-full"
                    }`}
                  />
                </div>
              ) : (
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
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
