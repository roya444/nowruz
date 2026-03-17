"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { sofrehItems } from "@/data/items";
import { UserSelection, ItemVariant } from "@/lib/types";
import NavBar from "@/components/NavBar";
import AccordionItemList from "@/components/AccordionItemList";
import SofrehPreview from "@/components/SofrehPreview";

export default function BuildPage() {
  const router = useRouter();
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    sofrehItems[0].id
  );

  const coreCount = useMemo(() => {
    const coreIds = new Set(
      sofrehItems.filter((i) => i.isCore).map((i) => i.id)
    );
    return selections.filter((s) => coreIds.has(s.itemId)).length;
  }, [selections]);

  const allCoreSelected = coreCount === 7;

  const handleToggleItem = useCallback((itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  }, []);

  const handleSelectVariant = useCallback(
    (itemId: string, variant: ItemVariant) => {
      setSelections((prev) => {
        const filtered = prev.filter((s) => s.itemId !== itemId);
        return [...filtered, { itemId, variantId: variant.id }];
      });

      // Auto-advance to next item after 400ms
      setTimeout(() => {
        const currentIdx = sofrehItems.findIndex((i) => i.id === itemId);
        if (currentIdx < sofrehItems.length - 1) {
          setExpandedItemId(sofrehItems[currentIdx + 1].id);
        } else {
          setExpandedItemId(null);
        }
      }, 400);
    },
    []
  );

  const handleViewSofreh = () => {
    sessionStorage.setItem("sofrehSelections", JSON.stringify(selections));
    router.push("/view");
  };

  return (
    <main className="h-screen bg-[#0F4637] relative overflow-hidden">
      {/* Gradient overlay — darkens toward bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,160,8,0) 0%, rgba(255,160,8,0.2) 100%)",
        }}
      />

      {/* Noise texture overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="5"
            numOctaves="1"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 0.984  0 0 0 0 0.878  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="relative z-10 flex flex-col h-full">
        {/* Nav bar */}
        <NavBar variant="dark" />

        {/* Two-panel layout */}
        <div className="pt-6 md:pt-10 px-4 md:px-[64px] flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start h-full">
            {/* Left: Accordion list */}
            <div className="w-full lg:w-[40%] overflow-y-auto h-full">
              <AccordionItemList
                items={sofrehItems}
                selections={selections}
                expandedItemId={expandedItemId}
                onToggleItem={handleToggleItem}
                onSelectVariant={handleSelectVariant}
              />
            </div>

            {/* Right: Live preview */}
            <div className="w-full lg:flex-1 lg:self-start">
              <SofrehPreview selections={selections} />

              {/* View button */}
              {allCoreSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <button
                    onClick={handleViewSofreh}
                    className="flex items-center gap-10 mx-auto px-10 py-4 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors"
                  >
                    <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] sm:text-[18px] md:text-[24px] tracking-[0.08em] whitespace-nowrap">
                      ViEW MY HAFTSiN
                    </span>
                    <span className="text-[22px] sm:text-[26px] md:text-[32px]">
                      →
                    </span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
