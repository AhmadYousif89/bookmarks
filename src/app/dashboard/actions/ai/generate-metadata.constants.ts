export const HF_CHAT_COMPLETION_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";

export const DEFAULT_MODELS = [
  "Qwen/Qwen2.5-3B-Instruct",
  "meta-llama/Llama-3.1-8B-Instruct",
  "mistralai/Mistral-Nemo-Instruct-2407",
].filter((value): value is string => Boolean(value));

export const MAX_TAGS = 4;
