import { RateLimitError } from "@/lib/errors";

type RateLimitState = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as unknown as {
  sprintRateLimitStore?: Map<string, RateLimitState>;
};

const store = globalRateLimitStore.sprintRateLimitStore ?? new Map<string, RateLimitState>();

if (!globalRateLimitStore.sprintRateLimitStore) {
  globalRateLimitStore.sprintRateLimitStore = store;
}

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

export function checkRateLimit(key: string, limitOrOptions: number | RateLimitOptions, windowMs?: number) {
  const limit = typeof limitOrOptions === "number" ? limitOrOptions : limitOrOptions.max;
  const resolvedWindowMs =
    typeof limitOrOptions === "number" ? (windowMs ?? 60_000) : limitOrOptions.windowMs;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const nextState = {
      count: 1,
      resetAt: now + resolvedWindowMs,
    };

    store.set(key, nextState);
    return {
      allowed: true,
      remaining: Math.max(0, limit - nextState.count),
      resetAt: nextState.resetAt,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}

export function requireRateLimit(key: string, limit: number, windowMs: number) {
  const result = checkRateLimit(key, limit, windowMs);

  if (!result.allowed) {
    throw new RateLimitError();
  }

  return result;
}
