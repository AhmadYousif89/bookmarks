export type QueryMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type QueryRequest = {
  messages: QueryMessage[];
  model: string;
};

export type QueryOptions = {
  messages: QueryMessage[];
  model: string;
};

export type HuggingFaceChoice = {
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

export type HuggingFaceResponse = {
  [key: string]: string | HuggingFaceChoice["choices"];
};

export type HuggingFaceErrorPayload = {
  error?: unknown;
  message?: unknown;
  detail?: unknown;
  details?: unknown;
  type?: unknown;
  code?: unknown;
  param?: unknown;
};

export type GeneratedAIData = {
  title: string;
  description: string;
  url?: string;
  tags: string[];
  favicon?: string | null;
};

export type GenerateBookmarkMetadataResult = {
  success: boolean;
  data?: GeneratedAIData;
  error?: string;
  fieldError?: boolean;
};
