"use server";

import { normalizeUrl } from "@/lib/utils";
import { fetchFavicon } from "../_lib/util";

const HF_TOKEN = process.env.HF_TOKEN;

type QueryMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type QueryRequest = {
  messages: QueryMessage[];
  model: string;
};

type HuggingFaceChoice = {
  id: string;
  choices: {
    finish_reason: string;
    message: {
      content: string;
      refusal: null;
      role: string;
      annotations: null;
      audio: null;
      function_call: null;
      tool_calls: never[];
      reasoning_content: null;
    };
    stop_reason: number;
  }[];
  model: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens_details: string | null;
    prompt_tokens_details: string | null;
  };
};

type HuggingFaceResponse = {
  [key: string]: string | HuggingFaceChoice["choices"];
};

async function query(data: QueryRequest): Promise<HuggingFaceResponse> {
  if (!HF_TOKEN) {
    console.warn("Hugging Face API key is not set.");
    throw new Error("Hugging Face API key is not configured.");
  }

  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

export type GeneratedAIData = {
  title: string;
  description: string;
  url?: string;
  tags: string[];
  favicon?: string | null;
};

export async function generateBookmarkMetadata(data: FormData): Promise<{
  success: boolean;
  data?: GeneratedAIData;
  error?: string;
  fieldError?: boolean;
}> {
  const url = data.get("url") as string;
  if (!url) return { success: false, fieldError: true, error: "URL is required." };
  // parse and validate URL
  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
  if (!urlPattern.test(url)) {
    return { success: false, fieldError: true, error: "Invalid URL format." };
  }

  const prompt = `
You are a helpful assistant that generates bookmark metadata.

Given this link URL: "${url}"

Write a suitable title (max 30 characters), a short and helpful description (max 280 characters) and suggest 1 to 4 relevant capitalized tags.

Respond ONLY in JSON format:
{"title": "...", "description": "...", "tags": ["Tag1", "Tag2"]}
`;

  try {
    const response = await query({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemma-2-2b-it",
    });

    const rawText = Array.isArray(response.choices)
      ? response.choices[0].message
      : { content: null };

    // Try to extract JSON safely
    const match = rawText.content?.match(/\{[\s\S]*\}/);
    if (!match) {
      return { success: false, error: "Failed to parse AI response." };
    }

    try {
      const metadata = JSON.parse(match[0]);
      const normalizedUrl = normalizeUrl(url);
      let favicon = await fetchFavicon(normalizedUrl);
      if (!favicon) {
        favicon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
          normalizedUrl,
        )}&size=256`;
      }

      return {
        success: true,
        data: {
          title: (metadata.title?.trim() as string) || "",
          url: url, // Preserve the original URL and save some API tokens
          description: (metadata.description?.trim() as string) || "",
          tags: Array.isArray(metadata.tags) ? (metadata.tags as string[]) : [],
          favicon,
        },
      };
    } catch {
      return { success: false, error: "Failed to parse AI response." };
    }
  } catch (error) {
    console.error("Generation error:", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMsg };
  }
}
