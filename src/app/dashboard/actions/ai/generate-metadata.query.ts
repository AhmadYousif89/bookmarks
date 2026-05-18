import {
  formatErrorDetail,
  getErrorMessage,
  createUserFriendlyError,
  isUnsupportedModelError,
} from "./generate-metadata.helpers";
import type {
  HuggingFaceErrorPayload,
  HuggingFaceResponse,
  QueryOptions,
  QueryRequest,
} from "./generate-metadata.types";
import { HF_CHAT_COMPLETION_ENDPOINT, DEFAULT_MODELS } from "./generate-metadata.constants";

const HF_TOKEN = process.env.HF_TOKEN;

async function query(data: QueryRequest): Promise<HuggingFaceResponse> {
  if (!HF_TOKEN) {
    console.warn("Hugging Face API key is not set.");
    throw new Error("Hugging Face API key is not configured.");
  }

  const response = await fetch(HF_CHAT_COMPLETION_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    let message = `${response.status} ${response.statusText}`;

    try {
      const parsed = JSON.parse(bodyText) as HuggingFaceErrorPayload;
      message = getErrorMessage(parsed, message);
    } catch {
      if (bodyText.trim()) message = bodyText.trim();
    }

    throw new Error(`Hugging Face API error: ${message}`);
  }

  return response.json() as Promise<HuggingFaceResponse>;
}

export async function queryWithFallback(options: QueryOptions): Promise<HuggingFaceResponse> {
  const models = [...new Set([options.model, ...DEFAULT_MODELS].filter(Boolean))];
  let lastError: unknown;

  for (const model of models) {
    try {
      return await query({ messages: options.messages, model });
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : formatErrorDetail(error) || "";

      if (!isUnsupportedModelError(message)) throw error;
    }
  }

  if (lastError instanceof Error) {
    throw new Error(createUserFriendlyError(lastError.message));
  }

  throw new Error("The AI model is unavailable at the moment. Please try again later.");
}
