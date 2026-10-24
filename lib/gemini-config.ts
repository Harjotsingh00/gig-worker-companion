/** Cost- and latency-conscious model for the app's short worker guidance. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
export const BACKUP_GEMINI_MODEL = process.env.GEMINI_BACKUP_MODEL || "gemini-3.6-flash";
/** Optimized for quick multimodal document extraction and structured output. */
export const GEMINI_DOCUMENT_MODEL = process.env.GEMINI_DOCUMENT_MODEL || "gemini-3.5-flash-lite";
