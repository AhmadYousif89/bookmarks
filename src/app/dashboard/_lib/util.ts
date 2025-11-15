import * as cheerio from "cheerio";

export async function fetchFavicon(url: string) {
  try {
    const target = new URL(url);
    const base = `${target.protocol}//${target.hostname}`;

    const uaHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
    };

    // 1) Parse HTML for link rel icons (icon, shortcut icon, apple-touch-icon, mask-icon)
    try {
      const res = await fetch(url, { redirect: "follow", headers: uaHeaders });
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        const links = $('link[rel*="icon" i], link[rel="shortcut icon" i], link[rel="mask-icon" i]')
          .toArray()
          .map((el) => {
            const href = $(el).attr("href") || "";
            const sizes = ($(el).attr("sizes") || "").toLowerCase(); // e.g., "180x180" or "any"
            const type = ($(el).attr("type") || "").toLowerCase();
            // compute a weight: prefer PNG/SVG, larger sizes, apple-touch first
            let score = 0;
            if (type.includes("svg")) score += 50;
            if (href.endsWith(".svg")) score += 40;
            if (href.endsWith(".png")) score += 30;
            if (href.endsWith(".ico")) score += 10;
            if (sizes === "any") score += 60;
            const n = parseInt(sizes.split("x")[0] || "0", 10);
            score += isNaN(n) ? 0 : n; // bigger is better
            if ($(el).attr("rel")?.toLowerCase().includes("apple-touch")) score += 80;
            return { href, score };
          })
          .filter((l) => !!l.href)
          .sort((a, b) => b.score - a.score);

        if (links.length) return new URL(links[0].href, base).href;
      }
    } catch {
      // ignore
      console.warn("HTML parsing for favicon failed");
    }

    // common locations
    const candidates = [
      "/apple-touch-icon.png",
      "/apple-touch-icon-precomposed.png",
      "/favicon.svg",
      "/favicon.png",
      "/favicon.ico",
    ].map((p) => new URL(p, base).href);

    for (const href of candidates) {
      try {
        let resp = await fetch(href, { method: "HEAD", headers: uaHeaders });
        if (!resp.ok || !resp.headers.get("content-type")?.includes("image")) {
          // retry with GET if HEAD blocked
          resp = await fetch(href, { method: "GET", headers: uaHeaders });
        }
        if (resp.ok && resp.headers.get("content-type")?.includes("image")) {
          return href;
        }
      } catch {
        // ignore
      }
    }
    // Nothing found
    return null;
  } catch (err) {
    console.error("Favicon fetch failed:", err);
    return null;
  }
}

type RGB = { r: number; g: number; b: number };

const levels = [
  { threshold: 0, color: "#4C5C59" },
  { threshold: 70, color: "#F6A623" },
  { threshold: 140, color: "#D97757" },
  { threshold: 210, color: "#FD4740" },
  { threshold: 280, color: "#CB0A04" },
];

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // generate regex to extract [r,g,b] values
  return result
    ? {
        // convert hex to decimal
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); // convert decimal to hex
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  // Linear interpolation for each RGB component from color to color
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return rgbToHex({ r, g, b }); // Convert back to HEX
}

export const getColor = (count: number): string => {
  if (count >= levels[levels.length - 1].threshold) return levels[levels.length - 1].color;
  for (let i = 0; i < levels.length - 1; i++) {
    if (count >= levels[i].threshold && count < levels[i + 1].threshold) {
      const factor =
        (count - levels[i].threshold) / (levels[i + 1].threshold - levels[i].threshold);
      return interpolateColor(levels[i].color, levels[i + 1].color, factor);
    }
  }
  return levels[0].color;
};

export function getUserInitials(name: string) {
  const cleaned = (name || "").trim();
  if (!cleaned) return "U";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase()).filter(Boolean);
  const joined = letters.slice(0, 2).join("");
  return joined || cleaned[0].toUpperCase() || "U";
}
