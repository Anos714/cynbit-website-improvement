import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env, upstashConfigured } from "@/lib/env";

export type RateLimitBackend = "upstash" | "memory";

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfterSeconds: number;
  backend: RateLimitBackend;
};

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;
const upstashLimiters = new Map<string, Ratelimit>();
let upstashUnavailable = false;

export const FORM_RATE_LIMITS = {
  ipLimit: 5,
  ipWindowMs: 10 * 60 * 1000,
  emailLimit: 3,
  emailWindowMs: 60 * 60 * 1000,
  domainLimit: 15,
  domainWindowMs: 60 * 60 * 1000,
} as const;

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.timestamps.every((timestamp) => timestamp <= cutoff)) buckets.delete(bucketKey);
    }
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
  }

  const timestamps = (buckets.get(key)?.timestamps ?? []).filter((timestamp) => timestamp > cutoff);
  const oldest = timestamps[0] ?? now;
  const reset = oldest + windowMs;

  if (timestamps.length >= limit) {
    buckets.set(key, { timestamps });
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset,
      retryAfterSeconds: Math.max(1, Math.ceil((reset - now) / 1000)),
      backend: "memory",
    };
  }

  timestamps.push(now);
  buckets.set(key, { timestamps });
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    reset,
    retryAfterSeconds: 0,
    backend: "memory",
  };
}

function getUpstashLimiter(limit: number, windowMs: number) {
  if (!upstashConfigured || !env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const cacheKey = `${limit}:${windowMs}`;
  const cached = upstashLimiters.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    prefix: "cynbit:rl",
    analytics: false,
  });
  upstashLimiters.set(cacheKey, limiter);
  return limiter;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(limit, windowMs);

  if (limiter && !upstashUnavailable) {
    try {
      const result = await limiter.limit(key);
      const now = Date.now();
      return {
        allowed: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfterSeconds: result.success
          ? 0
          : Math.max(1, Math.ceil((result.reset - now) / 1000)),
        backend: "upstash",
      };
    } catch {
      upstashUnavailable = true;
      console.error(
        "[rate-limit] Upstash request failed; using the documented in-memory fallback.",
      );
    }
  }

  return memoryLimit(key, limit, windowMs);
}

export async function checkFormRateLimits(
  scope: string,
  ip: string,
  email: string,
): Promise<RateLimitResult> {
  const ipResult = await checkRateLimit(
    `${scope}:ip:${ip}`,
    FORM_RATE_LIMITS.ipLimit,
    FORM_RATE_LIMITS.ipWindowMs,
  );
  if (!ipResult.allowed) return ipResult;

  const normalizedEmail = email.trim().toLowerCase();
  const emailResult = await checkRateLimit(
    `${scope}:email:${normalizedEmail}`,
    FORM_RATE_LIMITS.emailLimit,
    FORM_RATE_LIMITS.emailWindowMs,
  );
  if (!emailResult.allowed) return emailResult;

  const domain = normalizedEmail.split("@")[1] ?? "unknown";
  return checkRateLimit(
    `${scope}:domain:${domain}`,
    FORM_RATE_LIMITS.domainLimit,
    FORM_RATE_LIMITS.domainWindowMs,
  );
}

export function resetRateLimitsForTests() {
  buckets.clear();
  upstashLimiters.clear();
  upstashUnavailable = false;
}
