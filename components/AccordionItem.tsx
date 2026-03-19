"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SofrehItem, ItemVariant } from "@/lib/types";
import VariantPicker from "./VariantPicker";

const pillSvgMap: Record<string, string> = {
  "sonbol-purple": "/hyacinth-blue.svg",
  "sonbol-pink": "/hyacinth-pink.svg",
  "sonbol-yellow": "/hyacinth-yellow.svg",
  "sabzeh-wheat": "/sabzeh-wheatgrass.svg",
  "sabzeh-lentil": "/sabzeh-lentil.svg",
  "sabzeh-mungbean": "/sabzeh-mungbean.svg",
  "sib-red": "/apple-red.svg",
  "sib-green": "/apple-green.svg",
  "sib-golden": "/apple-golden.svg",
  "senjed-checkered": "/senjed-checkered.svg",
  "senjed-woodgrain": "/senjed-woodgrain.svg",
  "sir-white": "/garlic-white.svg",
  "sir-purple": "/garlic-purple.svg",
  "sekkeh-gold": "/coins-gold.svg",
  "sekkeh-silver": "/coins-silver.svg",
  "sekkeh-mixed": "/coins-mixed.svg",
  "tokhmeh-spring": "/eggs-spring.svg",
  "tokhmeh-summer": "/eggs-summer.svg",
  "tokhmeh-fall": "/eggs-fall.svg",
  "tokhmeh-winter": "/eggs-winter.svg",
  "goldfish-orange": "/fish-orange.svg",
  "goldfish-red": "/fish-red.svg",
  "goldfish-yellow": "/fish-yellow.svg",
  "ayeneh-circular": "/mirror-circular.svg",
  "ayeneh-rectangular": "/mirror-rectangular.svg",
  "ayeneh-arched": "/mirror-arched.svg",
  "somaq-polkadot": "/sumac-polkadot.svg",
  "somaq-stripes": "/sumac-stripes.svg",
  "serkeh-ceramic": "/vinegar-ceramic.svg",
  "serkeh-glass": "/vinegar-glass.svg",
  "samanu-brass": "/samanu-brass.svg",
  "samanu-gold": "/samanu-gold.svg",
};

interface AccordionPillProps {
  item: SofrehItem;
  isExpanded: boolean;
  selectedVariantId?: string;
  onToggle: () => void;
}

export function AccordionPill({
  item,
  isExpanded,
  selectedVariantId,
  onToggle,
}: AccordionPillProps) {
  const selectedVariant = item.variants.find(
    (v) => v.id === selectedVariantId
  );
  const defaultVariantId = item.variants[0].id;
  const displaySvg = pillSvgMap[selectedVariant?.id ?? defaultVariantId];
  const displayEmoji = selectedVariant?.emoji ?? item.variants[0].emoji;

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2 px-5 h-[80px] rounded-t-[32px] ${
        isExpanded ? "bg-[#FFF8E8]" : "bg-[#FFFBF0] hover:bg-[#FFF8E8]"
      }`}
      style={{
        borderBottomLeftRadius: isExpanded ? 0 : 32,
        borderBottomRightRadius: isExpanded ? 0 : 32,
        transition: isExpanded
          ? "border-bottom-left-radius 0.05s, border-bottom-right-radius 0.05s"
          : "border-bottom-left-radius 0.15s 0.15s, border-bottom-right-radius 0.15s 0.15s",
      }}
    >
      {displaySvg ? (
        <img src={displaySvg} alt="" className="w-6 h-7 object-contain" />
      ) : (
        <span className="text-xl">{displayEmoji}</span>
      )}
      <span className="font-[family-name:var(--font-space-mono)] text-[16px] font-semibold text-[#333] flex-1 text-left truncate">
        {item.phoneticName}
      </span>
      {selectedVariantId && !isExpanded && (
        <span className="text-green-600 text-sm">&#10003;</span>
      )}
    </button>
  );
}

interface AccordionExpandedProps {
  item: SofrehItem;
  selectedVariantId?: string;
  onSelectVariant: (variant: ItemVariant) => void;
  expandedColumn: "left" | "right";
}

export function AccordionExpanded({
  item,
  selectedVariantId,
  onSelectVariant,
  expandedColumn,
}: AccordionExpandedProps) {
  // The top corner opposite the expanded pill is rounded; the side under the pill is flat
  const roundingClass =
    expandedColumn === "left"
      ? "rounded-bl-[32px] rounded-br-[32px] rounded-tr-[32px]"
      : "rounded-bl-[32px] rounded-br-[32px] rounded-tl-[32px]";

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ duration: 0.15, ease: [0.25, 0, 0.25, 1] }}
      className="overflow-hidden"
    >
      <div className={`bg-[#FFF8E8] ${roundingClass} px-5 pb-5 pt-3`}>
        <div className="mb-3">
          <p className="font-[family-name:var(--font-space-mono)] font-bold text-[15px] text-[#333]">
            {item.englishName}
          </p>
          <p className="font-[family-name:var(--font-space-mono)] text-[12px] text-gray-500">
            {item.phoneticName} ·{" "}
            <span className="font-[family-name:var(--font-noto-arabic)]">
              {item.farsiName}
            </span>
          </p>
          <p className="text-[12px] text-gray-400 italic mt-1">
            {item.symbolism}
          </p>
        </div>
        <div className="flex justify-start">
          <VariantPicker
            variants={item.variants}
            selectedId={selectedVariantId}
            onSelect={onSelectVariant}
          />
        </div>
      </div>
    </motion.div>
  );
}
