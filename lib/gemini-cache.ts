/**
 * Client-side Gemini Cache & Quota Pressure Protection
 * Prevents rapid API key limit exhaustion by:
 * 1. Caching identical prompt responses for 30 minutes
 * 2. Enforcing a 2.5-second cooldown between consecutive AI requests
 * 3. Tracking 1-minute request counts against free-tier 15 RPM limits
 */

interface CacheEntry {
  text: string;
  timestamp: number;
}

const CACHE_PREFIX = "saarthi_ai_cache_";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const COOLDOWN_MS = 2500; // 2.5 seconds minimum between AI calls

class GeminiQuotaGuard {
  private inMemoryCache = new Map<string, CacheEntry>();
  private lastRequestTime = 0;
  private recentRequestTimestamps: number[] = [];

  private hashKey(prompt: string, role: string, lang: string): string {
    return `${role}_${lang}_${prompt.trim().toLowerCase().slice(0, 150)}`;
  }

  public getCached(prompt: string, role: string, lang: string): string | null {
    const key = this.hashKey(prompt, role, lang);

    // 1. Check in-memory
    const mem = this.inMemoryCache.get(key);
    if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
      return mem.text;
    }

    // 2. Check session storage
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(CACHE_PREFIX + key);
        if (stored) {
          const parsed = JSON.parse(stored) as CacheEntry;
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            this.inMemoryCache.set(key, parsed);
            return parsed.text;
          }
        }
      } catch {}
    }

    return null;
  }

  public setCache(prompt: string, role: string, lang: string, text: string): void {
    const key = this.hashKey(prompt, role, lang);
    const entry: CacheEntry = { text, timestamp: Date.now() };
    this.inMemoryCache.set(key, entry);

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch {}
    }
  }

  public canMakeRequest(): { allowed: boolean; waitSeconds?: number; currentMinuteCount: number } {
    const now = Date.now();

    // Clean timestamps older than 60 seconds
    this.recentRequestTimestamps = this.recentRequestTimestamps.filter((t) => now - t < 60000);

    // Cooldown check (2.5s)
    if (now - this.lastRequestTime < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - this.lastRequestTime)) / 1000);
      return {
        allowed: false,
        waitSeconds: wait || 1,
        currentMinuteCount: this.recentRequestTimestamps.length,
      };
    }

    // Rate pressure check (Free tier is 15 RPM; warn/throttle if > 12 in 1 minute)
    if (this.recentRequestTimestamps.length >= 14) {
      const oldest = this.recentRequestTimestamps[0];
      const wait = Math.ceil((60000 - (now - oldest)) / 1000);
      return {
        allowed: false,
        waitSeconds: wait || 5,
        currentMinuteCount: this.recentRequestTimestamps.length,
      };
    }

    return { allowed: true, currentMinuteCount: this.recentRequestTimestamps.length };
  }

  public recordRequest(): void {
    const now = Date.now();
    this.lastRequestTime = now;
    this.recentRequestTimestamps.push(now);
  }

  public getMinuteUsage(): number {
    const now = Date.now();
    this.recentRequestTimestamps = this.recentRequestTimestamps.filter((t) => now - t < 60000);
    return this.recentRequestTimestamps.length;
  }
}

export const quotaGuard = new GeminiQuotaGuard();
