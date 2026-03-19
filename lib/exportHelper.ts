import { toPng } from "html-to-image";

/**
 * Converts all <img> elements inside a container to inline base64 data URLs
 * so html-to-image can capture them on mobile Safari.
 */
async function inlineAllImages(container: HTMLElement): Promise<() => void> {
  const imgs = container.querySelectorAll<HTMLImageElement>("img");
  const originals: { el: HTMLImageElement; src: string }[] = [];

  await Promise.all(
    Array.from(imgs).map(async (img) => {
      const src = img.getAttribute("src") || "";
      if (src.startsWith("data:")) return;

      try {
        const res = await fetch(src);
        const blob = await res.blob();

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

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
 * Temporarily removes box-shadow and drop-shadow from elements.
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

/**
 * Hides X (dismiss) buttons during export.
 */
function hideExportUI(container: HTMLElement): () => void {
  const originals: { el: HTMLElement; display: string }[] = [];

  container.querySelectorAll<HTMLElement>('[aria-label="Remove frame"]').forEach((el) => {
    originals.push({ el, display: el.style.display });
    el.style.display = "none";
  });

  return () => {
    originals.forEach(({ el, display }) => {
      el.style.display = display;
    });
  };
}

/**
 * Bakes CSS aspect-ratio into explicit height so html-to-image can render it.
 * Also ensures overflow:hidden containers have explicit dimensions.
 */
function bakeAspectRatios(container: HTMLElement): () => void {
  const originals: { el: HTMLElement; height: string; overflow: string }[] = [];

  container.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const style = getComputedStyle(el);
    if (style.aspectRatio && style.aspectRatio !== "auto") {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) {
        originals.push({
          el,
          height: el.style.height,
          overflow: el.style.overflow,
        });
        el.style.height = `${rect.height}px`;
      }
    }
  });

  return () => {
    originals.forEach(({ el, height, overflow }) => {
      el.style.height = height;
      el.style.overflow = overflow;
    });
  };
}

export async function exportToPng(element: HTMLElement): Promise<string> {
  const restoreImages = await inlineAllImages(element);
  const restoreAspect = bakeAspectRatios(element);
  const restoreShadows = removeShadows(element);
  const restoreUI = hideExportUI(element);

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#FFFBF0",
    });
    return dataUrl;
  } finally {
    restoreUI();
    restoreShadows();
    restoreAspect();
    restoreImages();
  }
}
