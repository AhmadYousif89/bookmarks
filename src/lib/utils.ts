import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(word: string) {
  return word.length === 0 ? word : word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function formatDate(
  date: Date | string,
  locales: Intl.LocalesArgument = "en-GB",
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat(locales, {
    day: "numeric",
    month: "short",
    ...options,
  }).format(new Date(date));
}

export function formatVisitCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return count.toString();
  }
}

export function normalizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("www.")) return "https://" + url;
  return "https://" + url;
}
