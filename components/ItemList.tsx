"use client";

import { SofrehItem, UserSelection } from "@/lib/types";

interface ItemListProps {
  items: SofrehItem[];
  selections: UserSelection[];
  activeItemId: string;
  onSelectItem: (itemId: string) => void;
}

export default function ItemList({
  items,
  selections,
  activeItemId,
  onSelectItem,
}: ItemListProps) {
  const coreItems = items.filter((i) => i.isCore);
  const extraItems = items.filter((i) => !i.isCore);

  const isSelected = (itemId: string) =>
    selections.some((s) => s.itemId === itemId);

  const renderItem = (item: SofrehItem) => {
    const selected = isSelected(item.id);
    const isActive = activeItemId === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onSelectItem(item.id)}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
          isActive
            ? "bg-spring text-white shadow-md"
            : selected
              ? "bg-green-50 border border-green-200"
              : "bg-white border border-gray-100 hover:border-gold"
        }`}
      >
        <span className="text-lg">
          {selected ? "✅" : item.isCore ? "⭐" : "➕"}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium text-sm ${isActive ? "text-white" : "text-charcoal"}`}
          >
            {item.phoneticName}
          </p>
          <p
            className={`text-xs ${isActive ? "text-green-100" : "text-gray-500"}`}
          >
            {item.englishName}
          </p>
        </div>
        <span className="text-base" dir="rtl">
          {item.farsiName}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
          The 7 Haftsin Items
        </h3>
        <div className="space-y-1.5">{coreItems.map(renderItem)}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
          Additional Items
        </h3>
        <div className="space-y-1.5">{extraItems.map(renderItem)}</div>
      </div>
    </div>
  );
}
