type WindowState = { count: number; expiresAt: number };
type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

const windows = new Map<string, WindowState>();
const MAX_BUCKETS = 2_000;
const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 10;

/** Process-local guardrail for the demo's shared Gemini key. Use a shared store for multi-instance production. */
export function consumeGeminiRequest(identifier: string, now = Date.now()): RateLimitResult {
  for (const [key, state] of windows) {
    if (state.expiresAt <= now) windows.delete(key);
  }

  let state = windows.get(identifier);
  if (!state || state.expiresAt <= now) {
    if (windows.size >= MAX_BUCKETS) {
      const oldestKey = windows.keys().next().value;
      if (oldestKey) windows.delete(oldestKey);
    }
    state = { count: 0, expiresAt: now + WINDOW_MS };
    windows.set(identifier, state);
  }

  if (state.count >= REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((state.expiresAt - now) / 1000)) };
  }

  state.count += 1;
  return { allowed: true, remaining: REQUESTS_PER_WINDOW - state.count, retryAfterSeconds: 0 };
}

export function getRequestIdentifier(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  return (realIp || forwardedIp || "unknown").slice(0, 64);
}
