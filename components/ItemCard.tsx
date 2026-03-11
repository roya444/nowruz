"use client";

import { SofrehItem, ItemVariant } from "@/lib/types";
import VariantPicker from "./VariantPicker";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: SofrehItem;
  selectedVariantId?: string;
  onSelectVariant: (variant: ItemVariant) => void;
}

export default function ItemCard({
  item,
  selectedVariantId,
  onSelectVariant,
}: ItemCardProps) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-amber-100"
    >
      <div className="text-center mb-4">
        <p className="text-4xl mb-2">
          {item.variants.find((v) => v.id === selectedVariantId)?.emoji ??
            item.variants[0].emoji}
        </p>
        <h2 className="text-2xl font-bold text-charcoal">{item.englishName}</h2>
        <p className="text-lg text-spring font-semibold">{item.phoneticName}</p>
        <p className="text-2xl mt-1" dir="rtl">
          {item.farsiName}
        </p>
      </div>

      <p className="text-gray-600 text-center mb-6 italic">
        &ldquo;{item.symbolism}&rdquo;
      </p>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-2 text-center">
          Choose a style:
        </p>
        <VariantPicker
          variants={item.variants}
          selectedId={selectedVariantId}
          onSelect={onSelectVariant}
        />
      </div>
    </motion.div>
  );
}
