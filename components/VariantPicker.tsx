"use client";

import { ItemVariant } from "@/lib/types";

// Map variant IDs to SVG illustration paths for the picker
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

interface VariantPickerProps {
  variants: ItemVariant[];
  selectedId?: string;
  onSelect: (variant: ItemVariant) => void;
}

export default function VariantPicker({
  variants,
  selectedId,
  onSelect,
}: VariantPickerProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {variants.map((v) => {
        const svgPath = variantSvgMap[v.id];
        return (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all ${
              selectedId === v.id
                ? "border-spring bg-green-50 shadow-md scale-105"
                : "border-gray-200 hover:border-gold hover:bg-amber-50"
            }`}
          >
            {svgPath ? (
              <img
                src={svgPath}
                alt={v.label}
                className="w-8 h-10 object-contain"
              />
            ) : (
              <span className="text-2xl">{v.emoji}</span>
            )}
            <span className="text-xs font-medium text-gray-700">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
