"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sofrehItems } from "@/data/items";
import { UserSelection } from "@/lib/types";

// Photo frame definitions: desktop and mobile layouts
const desktopFrames = [
  { id: 0, top: "4%", left: "5%", width: "16%", aspectRatio: "3/4" },     // 3:4 portrait, upper-left
  { id: 1, top: "4%", left: "24%", width: "14%", aspectRatio: "4/3" },    // 4:3 landscape, upper-left
  { id: 2, top: "5%", left: "60%", width: "14%", aspectRatio: "3/4" },    // 3:4 portrait
  { id: 3, top: "8%", left: "77%", width: "15%", aspectRatio: "4/3" },    // 4:3 landscape, far right
  { id: 4, top: "20%", left: "24%", width: "10%", aspectRatio: "3/4" },   // 3:4 portrait
];

// Mobile frames use aspect-ratio CSS; height is auto.
// Container is 9:16 so width% maps to actual px; we use aspectRatio to enforce ratios.
const mobileFrames = [
  // Row 1
  { id: 0, top: "8%", left: "6%", width: "28%", aspectRatio: "3/4" },     // 3:4 portrait, top-left
  { id: 1, top: "8%", left: "37%", width: "26%", aspectRatio: "4/3" },    // 4:3 landscape, top-center
  { id: 2, top: "8%", left: "66%", width: "28%", aspectRatio: "3/4" },    // 3:4 portrait, top-right
  // Row 2
  { id: 3, top: "20%", left: "36%", width: "28%", aspectRatio: "3/4" },   // 3:4 portrait, center
  // Row 3
  { id: 4, top: "30%", left: "6%", width: "28%", aspectRatio: "3/4" },    // 3:4 portrait, bottom-left
  { id: 5, top: "30%", left: "66%", width: "28%", aspectRatio: "3/4" },   // 3:4 portrait, bottom-right
];

interface SofrehPreviewProps {
  selections: UserSelection[];
  /** When true on mobile, shifts content up to focus on the sofreh items */
  cropToSofreh?: boolean;
  /** Override the desktop aspect ratio (default 75%) */
  desktopAspect?: string;
  /** Show photo frame placeholders */
  showPhotoFrames?: boolean;
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

// Percentage-based center positions measured from the Figma reference (965×696 canvas)
const positions: { top: string; left: string }[] = [
  // Core 7
  { top: "52%", left: "38%" },    // 0: sabzeh — center-left
  { top: "65%", left: "55%" },    // 1: samanu — right of mirror
  { top: "63%", left: "10%" },    // 2: senjed
  { top: "54%", left: "64%" },    // 3: sir (garlic) — right
  { top: "52%", left: "81%" },    // 4: sib (apple) — right side
  { top: "68%", left: "71%" },    // 5: somaq — right of garlic
  { top: "48%", left: "25%" },    // 6: serkeh (vinegar)
  // Additional 6
  { top: "24%", left: "68%" },    // 7: sonbol (hyacinth) — upper-right
  { top: "78%", left: "56%" },    // 8: sekkeh (coins)
  { top: "95%", left: "50%" },    // 9: shirini — bottom center
  { top: "35%", left: "1%" },     // 10: goldfish — upper-left
  { top: "67%", left: "16%" },    // 11: tokhmeh (eggs)
  { top: "16%", left: "38%" },    // 12: ayeneh (mirror) — centered
];

// Base sizes in px at the reference container width (530px).
// Items scale proportionally when the container is smaller or larger.
const REFERENCE_WIDTH = 530;

const baseSizeMap: Record<string, { w: number; h: number }> = {
  ayeneh:   { w: 108, h: 207 },
  goldfish: { w: 137, h: 137 },
  sonbol:   { w: 103, h: 164 },
  tokhmeh:  { w: 145, h: 126 },
  sekkeh:   { w: 120, h: 66 },
  senjed:   { w: 86, h: 53 },
  sabzeh:   { w: 89, h: 103 },
  sib:      { w: 68, h: 77 },
  sir:      { w: 42, h: 48 },
  samanu:   { w: 78, h: 48 },
  somaq:    { w: 72, h: 53 },
  serkeh:   { w: 54, h: 78 },
  shirini:  { w: 78, h: 48 },
};

const defaultBaseSize = { w: 80, h: 96 };

// Per-variant position overrides (e.g. circular mirror sits higher)
const variantPositionOverrides: Record<string, { top?: string; left?: string }> = {
  "ayeneh-circular": { top: "9%" },  // down 1%
};

// Mobile-only variant position overrides
const mobileVariantOverrides: Record<string, { top?: number; left?: number }> = {
  "ayeneh-circular": { top: 4 },  // up 1% from prev
};

// Mobile-only position offsets (added to desktop values)
const mobileOffset: Record<string, { top?: number; left?: number }> = {
  ayeneh:   { top: 25 },          // mirror
  goldfish: { top: 20 },          // fish
  sonbol:   { top: 23 },          // hyacinth — up 2%
  serkeh:   { top: 5, left: 1 },  // vinegar — left 2%
  sib:      { top: 10 },          // apple
  sabzeh:   { top: 7, left: -8 },  // wheatgrass — up 3%, left 8%
  sir:      { top: 5 },           // garlic
  senjed:   { top: 5 },
  tokhmeh:  { top: 3, left: 3 },   // eggs — up 2%, right 3%
  samanu:   { top: 0, left: -2 },  // left 2%
  somaq:    { top: 0, left: -2 }, // sumac — left 2%
  sekkeh:   { top: -5, left: -3 }, // coins — up 2%, left 3%
};

// Z-index for depth: back items (higher on sofreh) lower z, front items higher z
const zIndexMap: Record<string, number> = {
  ayeneh:   0,   // behind everything including vinegar
  sonbol:   2,   // behind everything except mosaic
  samanu:   14,
  goldfish: 2,   // behind everything except mosaic
  senjed:   20,
  sib:      22,
  sir:      13,  // behind samanu (14)
  somaq:    23,  // behind garlic (24), in front of apple (22)
  serkeh:   1,   // behind fishbowl
  sabzeh:   28,  // behind eggs (30), in front of vinegar
  tokhmeh:  30,
  sekkeh:   30,
  shirini:  30,
};

export default function SofrehPreview({ selections, cropToSofreh = false, desktopAspect = "75%", showPhotoFrames = false }: SofrehPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [hiddenFrames, setHiddenFrames] = useState<Set<number>>(new Set());
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFrameClick = useCallback((frameId: number) => {
    fileInputRefs.current[frameId]?.click();
  }, []);

  const handleRemoveFrame = useCallback((frameId: number) => {
    setHiddenFrames((prev) => new Set(prev).add(frameId));
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[frameId];
      return next;
    });
  }, []);

  const handleFileChange = useCallback((frameId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resize photo to max 600px so export doesn't choke on huge base64 strings
    const img = new Image();
    img.onload = () => {
      const MAX = 600;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPhotos((prev) => ({ ...prev, [frameId]: dataUrl }));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setScale(width / REFERENCE_WIDTH);
    });
    observer.observe(el);

    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getVariant = (sel: UserSelection) => {
    const item = sofrehItems.find((i) => i.id === sel.itemId);
    const variant = item?.variants.find((v) => v.id === sel.variantId);
    return { item, variant };
  };

  // Map item id to its position index
  const itemIndexMap = new Map(sofrehItems.map((item, idx) => [item.id, idx]));

  const mobileSizeBoost: Record<string, number> = {
    sabzeh: 1.10,  // wheatgrass 10% bigger on mobile
    samanu: 1.18,  // samanu 18% bigger on mobile
    somaq: 1.16,   // somaq 16% bigger on mobile
    sekkeh: 1.05,  // coins 5% bigger on mobile
    sir: 1.05,     // garlic 5% bigger on mobile
    senjed: 1.11,  // senjed 11% bigger on mobile
    serkeh: 1.11,  // vinegar 11% bigger on mobile
  };

  const getScaledSize = (itemId: string) => {
    const base = baseSizeMap[itemId] ?? defaultBaseSize;
    const mobileBoost = isMobile ? 1.22 * (mobileSizeBoost[itemId] ?? 1) : 1;
    // Render at display size — SVGs are vector so they stay crisp
    return {
      width: Math.round(base.w * scale * mobileBoost),
      height: Math.round(base.h * scale * mobileBoost),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[25px] overflow-hidden"
      style={{ paddingBottom: isMobile ? "177.78%" : desktopAspect }}
    >
      {/* Inner wrapper — shifts up on mobile build view to focus on sofreh */}
      <div
        className="absolute inset-0"
        style={cropToSofreh && isMobile ? { top: "-35%", bottom: "35%" } : undefined}
      >
      {/* Cream top area */}
      <div className="absolute inset-0 bg-[#fffbf1]" />

      {/* Photo frame placeholders */}
      {showPhotoFrames && (isMobile ? mobileFrames : desktopFrames)
        .filter((frame) => !hiddenFrames.has(frame.id))
        .map((frame) => (
        <div
          key={frame.id}
          className="absolute group"
          style={{ top: frame.top, left: frame.left, width: frame.width, zIndex: 1 }}
        >
          <div
            onClick={() => handleFrameClick(frame.id)}
            className={`relative rounded-lg flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
              photos[frame.id] ? "shadow-[0_2px_6px_rgba(0,0,0,0.2)]" : "border-2 border-dashed border-[#c4a97d]/40 hover:border-[#c4a97d]/70"
            }`}
            style={{ aspectRatio: frame.aspectRatio }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => { fileInputRefs.current[frame.id] = el; }}
              onChange={(e) => handleFileChange(frame.id, e)}
            />
            {photos[frame.id] ? (
              <img
                src={photos[frame.id]}
                alt="Uploaded photo"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#c4a97d]/50 text-3xl font-light">+</span>
                <span className="text-[#c4a97d]/70 text-[9px]">add a photo!</span>
              </div>
            )}
          </div>
          {photos[frame.id] && (
            <img
              src={frame.aspectRatio === "4/3" ? "/frame-horizontal.svg" : "/frame-vertical.svg"}
              alt=""
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-[2]"
            />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveFrame(frame.id); }}
            className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#c4a97d]/60 hover:bg-[#c4a97d] text-white text-xs flex items-center justify-center transition-opacity z-10 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            aria-label="Remove frame"
          >
            ×
          </button>
        </div>
      ))}

      {/* Blue mosaic bottom area with curved top edge — shifted down 30% */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          borderRadius: "50% 50% 0 0 / 60px 60px 0 0",
          backgroundColor: "#0F4637",
          backgroundImage: "url('/mosaic-tile-combined.svg')",
          backgroundSize: "342px 174px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Selected items with animation */}
      <AnimatePresence>
        {selections.map((sel) => {
          const { item, variant } = getVariant(sel);
          if (!item || !variant) return null;
          const idx = itemIndexMap.get(sel.itemId)!;
          const pos = positions[idx];

          const svgPath = variantSvgMap[variant.id];
          const size = getScaledSize(item.id);
          const overrides = variantPositionOverrides[variant.id];
          let top = overrides?.top ?? pos.top;
          let left = overrides?.left ?? pos.left;

          // Apply mobile-only position offsets
          if (isMobile) {
            const mo = mobileOffset[item.id];
            if (mo?.top) top = `${parseFloat(top) + mo.top}%`;
            if (mo?.left) left = `${parseFloat(left) + mo.left}%`;
            const mvo = mobileVariantOverrides[variant.id];
            if (mvo?.top) top = `${parseFloat(top) + mvo.top}%`;
            if (mvo?.left) left = `${parseFloat(left) + mvo.left}%`;
          }

          return (
            <motion.div
              key={sel.itemId}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top, left, zIndex: zIndexMap[item.id] ?? 15 }}
            >
              {svgPath ? (
                <div
                  className={`relative ${item.id === "ayeneh" ? "drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]" : ""}`}
                  style={{ width: size.width, height: size.height }}
                >
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
                    className={`relative object-contain ${
                      item.id === "goldfish"
                        ? "absolute top-[30%] left-[15%] w-[55%] h-[40%]"
                        : "w-full h-full"
                    }`}
                  />
                </div>
              ) : (
                <div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg text-center border border-amber-100"
                  style={{
                    padding: `${Math.round(8 * scale)}px ${Math.round(12 * scale)}px`,
                  }}
                >
                  <span className="block" style={{ fontSize: Math.round(28 * scale) }}>
                    {variant.emoji}
                  </span>
                  <p
                    className="font-semibold text-[#333]"
                    style={{ fontSize: Math.round(12 * scale), marginTop: 2 }}
                  >
                    {item.phoneticName}
                  </p>
                  <p className="text-gray-500" style={{ fontSize: Math.round(10 * scale) }}>
                    {variant.label}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Watermark */}
      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end z-40 pointer-events-none">
        <span className="font-[family-name:var(--font-space-mono)] text-[12px] text-white/70">
          created by @roya.paydarfar
        </span>
        <span className="font-[family-name:var(--font-space-mono)] text-[12px] text-white/70">
          www.mynowruz.com
        </span>
      </div>
      </div>
    </div>
  );
}
