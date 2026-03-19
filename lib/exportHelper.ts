import { toPng } from "html-to-image";

/**
 * Converts all <img> elements with SVG sources inside a container
 * to inline base64 data URLs so html-to-image can capture them.
 * Returns a cleanup function that restores the original sources.
 */
async function inlineSvgImages(container: HTMLElement): Promise<() => void> {
  const imgs = container.querySelectorAll<HTMLImageElement>("img");
  const originals: { el: HTMLImageElement; src: string }[] = [];

  await Promise.all(
    Array.from(imgs).map(async (img) => {
      const src = img.getAttribute("src") || "";
      if (!src.endsWith(".svg")) return;

      try {
        const res = await fetch(src);
        const text = await res.text();
        const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
        originals.push({ el: img, src });
        img.setAttribute("src", dataUrl);
      } catch {
        // Skip if fetch fails
      }
    })
  );

  return () => {
    originals.forEach(({ el, src }) => el.setAttribute("src", src));
  };
}

/**
 * Temporarily removes box-shadow and drop-shadow from elements
 * inside a container for clean PNG export.
 */
function removeShadows(container: HTMLElement): () => void {
  const elements = container.querySelectorAll<HTMLElement>("*");
  const originals: { el: HTMLElement; boxShadow: string; filter: string }[] = [];

  elements.forEach((el) => {
    const style = getComputedStyle(el);
    if (style.boxShadow !== "none" || style.filter.includes("drop-shadow")) {
      originals.push({
        el,
        boxShadow: el.style.boxShadow,
        filter: el.style.filter,
      });
      el.style.boxShadow = "none";
      if (style.filter.includes("drop-shadow")) {
        el.style.filter = style.filter.replace(/drop-shadow\([^)]*\)/g, "").trim() || "none";
      }
    }
  });

  return () => {
    originals.forEach(({ el, boxShadow, filter }) => {
      el.style.boxShadow = boxShadow;
      el.style.filter = filter;
    });
  };
}

export async function exportToPng(element: HTMLElement): Promise<string> {
  const restoreImages = await inlineSvgImages(element);
  const restoreShadows = removeShadows(element);

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#FFFBF0",
    });
    return dataUrl;
  } finally {
    restoreShadows();
    restoreImages();
  }
}
