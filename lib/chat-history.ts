import type { ChatMessage } from "./chat-contract.ts";
import { MAX_CONVERSATION_CHARS, MAX_MESSAGES } from "./chat-contract.ts";

/** Keep recent turns within the API limit and preserve user-first alternation. */
export function getRecentChatMessages(messages: ChatMessage[]): ChatMessage[] {
  // Leave one slot so a conversation with an odd number of turns stays user-first.
  const recent = messages.slice(-(MAX_MESSAGES - 1));
  while (recent.length > 1 && recent.reduce((total, message) => total + message.content.length, 0) > MAX_CONVERSATION_CHARS) {
    recent.splice(0, 2);
  }
  return recent;
}
