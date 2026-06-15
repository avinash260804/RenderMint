import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { RateLimitError } from "@/lib/errors";

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const globalRateLimitState = globalThis as unknown as {
  designersHubRateLimitStore?: Map<string, RateLimitState>;
  designersHubRateLimiters?: Map<string, Ratelimit>;
  designersHubRateLimitEphemeralCache?: Map<string, number>;
  designersHubRedisClient?: Redis;
};

const memoryStore =
  globalRateLimitState.designersHubRateLimitStore ?? new Map<string, RateLimitState>();
const limiters = globalRateLimitState.designersHubRateLimiters ?? new Map<string, Ratelimit>();
const ephemeralCache =
  globalRateLimitState.designersHubRateLimitEphemeralCache ?? new Map<string, number>();

globalRateLimitState.designersHubRateLimitStore ??= memoryStore;
globalRateLimitState.designersHubRateLimiters ??= limiters;
globalRateLimitState.designersHubRateLimitEphemeralCache ??= ephemeralCache;

const canUseRedisBackedLimiter =
  process.env.NODE_ENV !== "test" &&
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

function getRedisClient() {
  if (!canUseRedisBackedLimiter) {
    return undefined;
  }

  if (!globalRateLimitState.designersHubRedisClient) {
    globalRateLimitState.designersHubRedisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  return globalRateLimitState.designersHubRedisClient;
}

function checkInMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    const nextState = {
      count: 1,
      resetAt: now + windowMs,
    };

    memoryStore.set(key, nextState);

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
  memoryStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}

function getLimiter(windowMs: number, max: number) {
  const cacheKey = `${windowMs}:${max}`;
  const existing = limiters.get(cacheKey);
  if (existing) {
    return existing;
  }

  const redis = getRedisClient();
  if (!redis) {
    return undefined;
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
    analytics: false,
    ephemeralCache,
  });

  limiters.set(cacheKey, limiter);
  return limiter;
}

export async function checkRateLimit(
  key: string,
  limitOrOptions: number | RateLimitOptions,
  windowMs?: number,
): Promise<RateLimitResult> {
  const limit = typeof limitOrOptions === "number" ? limitOrOptions : limitOrOptions.max;
  const resolvedWindowMs =
    typeof limitOrOptions === "number" ? (windowMs ?? 60_000) : limitOrOptions.windowMs;

  const limiter = getLimiter(resolvedWindowMs, limit);
  if (!limiter) {
    return checkInMemoryRateLimit(key, limit, resolvedWindowMs);
  }

  const { success, remaining, reset } = await limiter.limit(key);

  return {
    allowed: success,
    remaining,
    resetAt: reset,
  };
}

export async function requireRateLimit(key: string, limit: number, windowMs: number) {
  const result = await checkRateLimit(key, limit, windowMs);

  if (!result.allowed) {
    throw new RateLimitError();
  }

  return result;
}

export function resetRateLimitStateForTests() {
  memoryStore.clear();
  ephemeralCache.clear();
  limiters.clear();
}
