type ProviderError = { status?: unknown };

export type GeminiFailure = { message: string; providerStatus?: number };

/** Map only the provider's numeric status to user-safe guidance; never return raw error details. */
export function getGeminiFailure(error: unknown, task: "chat" | "document"): GeminiFailure {
  const providerStatus =
    typeof error === "object" && error !== null && "status" in error
      ? (error as ProviderError).status
      : undefined;
  const status = typeof providerStatus === "number" && Number.isInteger(providerStatus)
    ? providerStatus
    : undefined;

  if (status === 401 || status === 403) {
    return { message: "Gemini denied this request. Check that the API key is valid and has access to this model.", providerStatus: status };
  }
  if (status === 429) {
    return { message: "Gemini quota or rate limit reached. Check your Google AI Studio quota before trying again.", providerStatus: status };
  }
  if (status === 400) {
    return { message: "Gemini rejected the request. Check the prompt or document and try again.", providerStatus: status };
  }
  if (status !== undefined && status >= 500) {
    return { message: "Gemini is temporarily unavailable. Please try again shortly.", providerStatus: status };
  }

  const subject = task === "document" ? "analyze the document" : "reply";
  return {
    message: `Gemini could not ${subject}. Check the API key, model access, quota, and connection, then try again.`,
    ...(status === undefined ? {} : { providerStatus: status }),
  };
}
