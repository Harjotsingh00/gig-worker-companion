/** Keep the default on a currently supported stable Flash model. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
export const BACKUP_GEMINI_MODEL = process.env.GEMINI_BACKUP_MODEL || "gemini-3.6-flash";
/** Optimized for quick multimodal document extraction and structured output. */
export const GEMINI_DOCUMENT_MODEL = process.env.GEMINI_DOCUMENT_MODEL || "gemini-3.5-flash-lite";
