"use client";

import { sofrehItems } from "@/data/items";
import { UserSelection } from "@/lib/types";
import { forwardRef } from "react";

interface SofrehDisplayProps {
  selections: UserSelection[];
}

const SofrehDisplay = forwardRef<HTMLDivElement, SofrehDisplayProps>(
  function SofrehDisplay({ selections }, ref) {
    const getVariant = (sel: UserSelection) => {
      const item = sofrehItems.find((i) => i.id === sel.itemId);
      const variant = item?.variants.find((v) => v.id === sel.variantId);
      return { item, variant };
    };

    // Layout positions for a top-down sofreh arrangement
    const positions = [
      // Core 7 in a circle-ish pattern
      { top: "8%", left: "50%", transform: "translateX(-50%)" },
      { top: "25%", left: "20%" },
      { top: "25%", left: "75%" },
      { top: "45%", left: "12%" },
      { top: "45%", left: "82%" },
      { top: "65%", left: "25%" },
      { top: "65%", left: "70%" },
      // Extras around edges
      { top: "38%", left: "50%", transform: "translateX(-50%)" },
      { top: "82%", left: "30%" },
      { top: "82%", left: "65%" },
      { top: "55%", left: "50%", transform: "translateX(-50%)" },
      { top: "90%", left: "50%", transform: "translateX(-50%)" },
    ];

    return (
      <div
        ref={ref}
        className="relative w-[600px] h-[600px] mx-auto rounded-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-4 border-gold shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 70%),
            repeating-conic-gradient(from 0deg, rgba(76,175,80,0.03) 0deg 30deg, transparent 30deg 60deg)
          `,
        }}
      >
        {/* Decorative border pattern */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-200" />
        <div className="absolute inset-4 rounded-full border border-amber-100" />

        {/* Center decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20 pointer-events-none">
          <p className="text-6xl">🌿</p>
        </div>

        {selections.map((sel, idx) => {
          const { item, variant } = getVariant(sel);
          if (!item || !variant) return null;

          const pos = positions[idx] ?? { top: "50%", left: "50%" };

          return (
            <div
              key={sel.itemId}
              className="absolute flex flex-col items-center"
              style={pos}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg text-center border border-amber-100">
                <span className="text-3xl block">{variant.emoji}</span>
                <p className="text-xs font-semibold text-charcoal mt-1">
                  {item.phoneticName}
                </p>
                <p className="text-[10px] text-gray-500">{variant.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export default SofrehDisplay;
