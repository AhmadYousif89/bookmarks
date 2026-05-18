import { titleCase } from "@/lib/utils";

import type {
  HuggingFaceErrorPayload,
  HuggingFaceResponse,
  GeneratedAIData,
} from "./generate-metadata.types";
import { MAX_TAGS } from "./generate-metadata.constants";

export function formatErrorDetail(detail: unknown): string | null {
  if (typeof detail === "string") {
    const trimmed = detail.trim();
    return trimmed || null;
  }

  if (detail && typeof detail === "object") {
    try {
      return JSON.stringify(detail);
    } catch {
      return String(detail);
    }
  }

  if (detail == null) return null;
  return String(detail);
}

export function isUnsupportedModelError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("model_not_supported") ||
    normalized.includes("not supported by any provider") ||
    normalized.includes("unsupported by any provider") ||
    normalized.includes("provider you have enabled")
  );
}

export function createUserFriendlyError(message: string): string {
  if (isUnsupportedModelError(message)) {
    return "The AI model is unavailable at the moment. Please try again later.";
  }

  return message;
}

export function extractAssistantContent(response: HuggingFaceResponse): string | null {
  if (!Array.isArray(response.choices) || response.choices.length === 0) return null;

  const firstChoice = response.choices[0];
  const message = firstChoice?.message;

  return typeof message?.content === "string" ? message.content : null;
}

export function getErrorMessage(payload: HuggingFaceErrorPayload, fallback: string): string {
  return (
    formatErrorDetail(payload.detail) ||
    formatErrorDetail(payload.details) ||
    formatErrorDetail(payload.message) ||
    formatErrorDetail(payload.error) ||
    fallback
  );
}

export function inferTagsFromText(
  title: string,
  description: string,
  url?: string,
  maxTags = MAX_TAGS,
): string[] {
  const stopwords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "have",
    "were",
    "which",
    "when",
    "what",
    "where",
    "how",
    "why",
    "you",
    "your",
    "are",
    "but",
    "not",
    "all",
    "any",
    "was",
    "has",
    "had",
    "it's",
    "its",
    "will",
    "more",
    "than",
    "into",
    "about",
    "their",
    "they",
    "them",
    "can",
    "also",
    "use",
    "used",
    "using",
    "useful",
    "usefulness",
    "other",
    "site",
    "page",
    "article",
    "blog",
    "post",
    "learn",
    "read",
    "guide",
    "tips",
  ]);

  const text = `${title || ""} ${description || ""}`.toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];

  const freq = words.reduce<Record<string, number>>((acc, w) => {
    if (!stopwords.has(w)) acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {});

  const candidates = Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .map(titleCase);

  if (url) {
    try {
      const host = new URL(url).hostname;
      const domain = host.split(".")[0];
      if (domain && !candidates.includes(titleCase(domain))) {
        candidates.unshift(titleCase(domain));
      }
    } catch {
      // ignore URL parse errors
    }
  }

  const unique: string[] = [];
  for (const c of candidates) {
    if (!unique.includes(c)) unique.push(c);
    if (unique.length >= maxTags) break;
  }

  return unique;
}

export function normalizeGeneratedMetadata(
  metadata: Record<string, unknown>,
  normalizedUrl: string,
): GeneratedAIData {
  const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
  const description = typeof metadata.description === "string" ? metadata.description.trim() : "";
  const rawTags = Array.isArray(metadata.tags) ? metadata.tags : [];

  let tags: string[] = rawTags
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean)
    .map(titleCase);

  if (tags.length === 0) {
    tags = inferTagsFromText(title, description, normalizedUrl);
  } else {
    const unique: string[] = [];
    for (const tag of tags) {
      if (!unique.includes(tag)) unique.push(tag);
      if (unique.length >= MAX_TAGS) break;
    }
    tags = unique;
  }

  if (tags.length === 0) {
    try {
      const host = new URL(normalizedUrl).hostname;
      tags = [titleCase(host.split(".")[0] || "Bookmark")];
    } catch {
      tags = ["Bookmark"];
    }
  }

  return {
    title,
    description,
    url: normalizedUrl,
    tags,
  };
}
