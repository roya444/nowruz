"use client";

import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { SofrehItem, ItemVariant, UserSelection } from "@/lib/types";
import { AccordionPill, AccordionExpanded } from "./AccordionItem";

interface AccordionItemListProps {
  items: SofrehItem[];
  selections: UserSelection[];
  expandedItemId: string | null;
  onToggleItem: (itemId: string) => void;
  onSelectVariant: (itemId: string, variant: ItemVariant) => void;
  coreProgressTracker?: ReactNode;
}

export default function AccordionItemList({
  items,
  selections,
  expandedItemId,
  onToggleItem,
  onSelectVariant,
  coreProgressTracker,
}: AccordionItemListProps) {
  const coreItems = items.filter((i) => i.isCore);
  const additionalItems = items.filter((i) => !i.isCore);

  const renderSection = (title: string, sectionItems: SofrehItem[], afterTitle?: ReactNode) => {
    // Group items into rows of 2
    const rows: SofrehItem[][] = [];
    for (let i = 0; i < sectionItems.length; i += 2) {
      rows.push(sectionItems.slice(i, i + 2));
    }

    return (
      <div className="mb-4">
        <h3 className="font-[family-name:var(--font-space-mono)] text-[11px] font-bold text-[#FFFBF0] uppercase tracking-[0.12em] mb-2">
          {title}
        </h3>
        {afterTitle}
        <div className="flex flex-col">
          {rows.map((row, rowIdx) => {
            const expandedInRow = row.find((i) => i.id === expandedItemId);
            const expandedColIndex = expandedInRow
              ? row.indexOf(expandedInRow)
              : -1;
            const expandedColumn: "left" | "right" =
              expandedColIndex === 0 ? "left" : "right";

            return (
              <div key={rowIdx}>
                {/* Button row — always 2-column grid, 0px gap */}
                <div className="grid grid-cols-2">
                  {row.map((item) => {
                    const sel = selections.find(
                      (s) => s.itemId === item.id
                    );
                    return (
                      <AccordionPill
                        key={item.id}
                        item={item}
                        isExpanded={expandedItemId === item.id}
                        selectedVariantId={sel?.variantId}
                        onToggle={() => onToggleItem(item.id)}
                      />
                    );
                  })}
                </div>

                {/* Expanded content — drops below the row, full width */}
                <AnimatePresence initial={false}>
                  {expandedInRow && (
                    <AccordionExpanded
                      key={expandedInRow.id}
                      item={expandedInRow}
                      selectedVariantId={
                        selections.find(
                          (s) => s.itemId === expandedInRow.id
                        )?.variantId
                      }
                      onSelectVariant={(variant) =>
                        onSelectVariant(expandedInRow.id, variant)
                      }
                      expandedColumn={expandedColumn}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderSection("The 7 Haftsin Items", coreItems, coreProgressTracker)}
      {renderSection("Additional Items", additionalItems)}
    </div>
  );
}
