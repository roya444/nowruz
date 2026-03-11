"use client";

import { ItemVariant } from "@/lib/types";

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
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v)}
          className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all ${
            selectedId === v.id
              ? "border-spring bg-green-50 shadow-md scale-105"
              : "border-gray-200 hover:border-gold hover:bg-amber-50"
          }`}
        >
          <span className="text-2xl">{v.emoji}</span>
          <span className="text-xs font-medium text-gray-700">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
