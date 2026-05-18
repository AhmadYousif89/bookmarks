"use server";

import { normalizeUrl } from "@/lib/utils";
import { fetchFavicon } from "../_lib/util";

import {
  extractAssistantContent,
  createUserFriendlyError,
  normalizeGeneratedMetadata,
} from "./ai/generate-metadata.helpers";
import { queryWithFallback } from "./ai/generate-metadata.query";
import type { GeneratedAIData, GenerateBookmarkMetadataResult } from "./ai/generate-metadata.types";

export async function generateBookmarkMetadata(
  data: FormData,
): Promise<GenerateBookmarkMetadataResult> {
  const url = data.get("url") as string;
  if (!url) return { success: false, fieldError: true, error: "URL is required." };

  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
  if (!urlPattern.test(url)) {
    return { success: false, fieldError: true, error: "Invalid URL format." };
  }

  const prompt = `
You are a helpful assistant that generates bookmark metadata.

Given this URL: "${url}"

Write a suitable title (max 30 characters), a short and helpful description (max 280 characters) and suggest 1 to 4 relevant tags in capitalized form.

Respond ONLY in JSON format:
{"title": "...", "description": "...", "tags": ["Tag1", "Tag2", ...]}
`;

  try {
    const response = await queryWithFallback({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemma-2-2b-it",
    });

    const rawText = extractAssistantContent(response);
    const match = rawText?.match(/\{[\s\S]*\}/);

    if (!match) {
      return { success: false, error: "Failed to parse AI response." };
    }

    try {
      const metadata = JSON.parse(match[0]) as Record<string, unknown>;
      const normalizedUrl = normalizeUrl(url);
      let favicon = await fetchFavicon(normalizedUrl);

      if (!favicon) {
        favicon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
          normalizedUrl,
        )}&size=256`;
      }

      const generated: GeneratedAIData = normalizeGeneratedMetadata(metadata, normalizedUrl);

      return {
        success: true,
        data: {
          ...generated,
          url,
          favicon,
        },
      };
    } catch {
      return { success: false, error: "Failed to parse AI response." };
    }
  } catch (error) {
    console.error("Generation error:", error);
    const errMsg =
      error instanceof Error ? createUserFriendlyError(error.message) : "Unknown error";

    return { success: false, error: errMsg };
  }
}
