import {
  GIG_SAHAYAK_SYSTEM_PROMPT,
  supportedLanguages,
  workerRoles,
  type ChatLanguage,
  type WorkerRole,
} from "./prompts.ts";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatRequest = { messages: ChatMessage[]; role: WorkerRole; language: ChatLanguage };

export const MAX_REQUEST_BYTES = 64_000;
export const MAX_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 2_000;
export const MAX_CONVERSATION_CHARS = 10_000;

type ValidationResult =
  | { ok: true; value: ChatRequest }
  | { ok: false; status: 400 | 413; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateChatRequest(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return { ok: false, status: 400, error: "Invalid request." };
  }

  const { messages, role, language } = value;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    !workerRoles.includes(role as WorkerRole) ||
    !supportedLanguages.includes(language as ChatLanguage)
  ) {
    return { ok: false, status: 400, error: "Choose a valid role and language, then send a message." };
  }

  let conversationLength = 0;
  for (const [index, message] of messages.entries()) {
    if (
      !isRecord(message) ||
      message.role !== (index % 2 === 0 ? "user" : "assistant") ||
      typeof message.content !== "string" ||
      message.content.trim().length === 0 ||
      message.content.length > MAX_MESSAGE_CHARS
    ) {
      return { ok: false, status: 400, error: "Messages must contain valid, non-empty text." };
    }
    conversationLength += message.content.length;
  }

  if (conversationLength > MAX_CONVERSATION_CHARS) {
    return { ok: false, status: 413, error: "This conversation is too long. Start a new chat and try again." };
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return { ok: false, status: 400, error: "Messages must alternate between worker and assistant, starting and ending with the worker." };
  }

  return {
    ok: true,
    value: {
      messages: messages as ChatMessage[],
      role: role as WorkerRole,
      language: language as ChatLanguage,
    },
  };
}

export function buildSystemInstruction(role: WorkerRole, language: ChatLanguage): string {
  return `${GIG_SAHAYAK_SYSTEM_PROMPT}\n\nThe user's selected role is ${role}. The user selected ${language}; reply only in ${language}. For Indian government rights and schemes, never invent scheme names, eligibility rules, amounts, or deadlines, and never claim the worker qualifies based on incomplete details. If state, platform, or current rules may change the answer, say so plainly and ask one practical follow-up question. Encourage checking current details through official government sources.`;
}
