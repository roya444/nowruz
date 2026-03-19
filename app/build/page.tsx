"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { sofrehItems } from "@/data/items";
import { UserSelection, ItemVariant } from "@/lib/types";
import NavBar from "@/components/NavBar";
import AccordionItemList from "@/components/AccordionItemList";
import SofrehPreview from "@/components/SofrehPreview";
import VariantPicker from "@/components/VariantPicker";
import MusicPlayer from "@/components/MusicPlayer";
import Footer from "@/components/Footer";

export default function BuildPage() {
  const router = useRouter();
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    "sabzeh"
  );
  const visibleItems = useMemo(
    () => sofrehItems.filter((i) => !i.hidden),
    []
  );
  const [mobileCategoryIdx, setMobileCategoryIdx] = useState(0);

  const coreCount = useMemo(() => {
    const coreIds = new Set(
      sofrehItems.filter((i) => i.isCore).map((i) => i.id)
    );
    return selections.filter((s) => coreIds.has(s.itemId)).length;
  }, [selections]);

  const allCoreSelected = coreCount === 7;

  const allVisibleSelected = useMemo(() => {
    const selectedIds = new Set(selections.map((s) => s.itemId));
    return visibleItems.every((item) => selectedIds.has(item.id));
  }, [selections, visibleItems]);

  const coreItems = useMemo(
    () => sofrehItems.filter((i) => i.isCore),
    []
  );
  const selectedIds = useMemo(
    () => new Set(selections.map((s) => s.itemId)),
    [selections]
  );

  const handleToggleItem = useCallback((itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  }, []);

  const handleSelectVariant = useCallback(
    (itemId: string, variant: ItemVariant) => {
      setSelections((prev) => {
        const filtered = prev.filter((s) => s.itemId !== itemId);
        return [...filtered, { itemId, variantId: variant.id }];
      });
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

        {/* Desktop: Two-panel layout */}
        <div className="hidden min-[800px]:block pt-10 px-[64px] flex-1 min-h-0">
          <div className="flex flex-row gap-8 items-start h-full">
            {/* Left: Accordion list */}
            <div className="w-[40%] overflow-y-auto h-full">
              <MusicPlayer />
              <AccordionItemList
                items={sofrehItems.filter((i) => !i.hidden)}
                selections={selections}
                expandedItemId={expandedItemId}
                onToggleItem={handleToggleItem}
                onSelectVariant={handleSelectVariant}
                coreProgressTracker={
                  !allCoreSelected ? (
                    <div className="mb-3 px-1">
                      <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-[#FFFBF0] mb-2">
                        {coreCount}/7 core items selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coreItems.map((item) => {
                          const done = selectedIds.has(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleToggleItem(item.id)}
                              className={`font-[family-name:var(--font-space-mono)] text-[11px] px-2.5 py-1 rounded-full transition-all ${
                                done
                                  ? "bg-[#FFFBF0]/20 text-[#FFFBF0]/40 line-through"
                                  : "bg-[#FFFBF0]/10 text-[#FFFBF0] hover:bg-[#FFFBF0]/20"
                              }`}
                            >
                              {item.phoneticName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : undefined
                }
              />
            </div>

            {/* Right: Live preview */}
            <div className="flex-1 self-start relative">
              <SofrehPreview selections={selections} />

              {/* View button — overlays bottom of preview */}
              {allCoreSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-0 right-0 text-center z-40"
                >
                  <button
                    onClick={handleViewSofreh}
                    className="flex items-center gap-6 mx-auto px-6 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors"
                  >
                    <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] whitespace-nowrap">
                      ViEW MY HAFTSiN
                    </span>
                    <span className="text-[20px]">
                      →
                    </span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Preview on top, carousel category picker below */}
        <div className="min-[800px]:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 min-h-0 px-4 pt-4 overflow-hidden">
            <SofrehPreview selections={selections} cropToSofreh />
          </div>

          {/* Category carousel */}
          <div className="px-4 pt-6 pb-12">
            <MusicPlayer />
            {(() => {
              const currentItem = visibleItems[mobileCategoryIdx];
              const sel = selections.find((s) => s.itemId === currentItem.id);
              return (
                <div>
                  {/* Arrow nav + category name */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() =>
                        setMobileCategoryIdx((prev) =>
                          prev > 0 ? prev - 1 : visibleItems.length - 1
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFBF0] text-[#0F4637]"
                    >
                      <span className="text-lg font-bold">←</span>
                    </button>
                    <div className="text-center">
                      <p className="font-[family-name:var(--font-space-mono)] font-semibold text-[15px] text-[#FFFBF0]">
                        {currentItem.englishName}
                      </p>
                      <p className="font-[family-name:var(--font-space-mono)] text-[11px] text-[#FFFBF0]">
                        {currentItem.phoneticName} · {currentItem.farsiName}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setMobileCategoryIdx((prev) =>
                          prev < visibleItems.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFBF0] text-[#0F4637]"
                    >
                      <span className="text-lg font-bold">→</span>
                    </button>
                  </div>

                  {/* Variant picker */}
                  <VariantPicker
                    variants={currentItem.variants}
                    selectedId={sel?.variantId}
                    onSelect={(variant) =>
                      handleSelectVariant(currentItem.id, variant)
                    }
                  />

                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 mt-3">
                    {visibleItems.map((item, idx) => {
                      const isSelected = selections.some(
                        (s) => s.itemId === item.id
                      );
                      return (
                        <button
                          key={item.id}
                          onClick={() => setMobileCategoryIdx(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === mobileCategoryIdx
                              ? "bg-[#FFFBF0] scale-125"
                              : isSelected
                              ? "bg-[#FFFBF0]/60"
                              : "bg-white/25"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* View button — show after all carousel items selected */}
            {allVisibleSelected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center pb-2"
              >
                <button
                  onClick={handleViewSofreh}
                  className="flex items-center gap-6 mx-auto px-8 py-3 bg-[#FFFBF0] text-[#0F4637] rounded-[24px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#FFF8E8] transition-colors"
                >
                  <span className="font-[family-name:var(--font-space-mono)] font-bold text-[14px] tracking-[0.08em] whitespace-nowrap">
                    ViEW MY HAFTSiN
                  </span>
                  <span className="text-[22px]">→</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
