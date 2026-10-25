import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkFormRateLimits,
  checkRateLimit,
  FORM_RATE_LIMITS,
  resetRateLimitsForTests,
} from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-25T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit and rejects the next one", async () => {
    const key = `test-limit-${Math.random()}`;
    const first = await checkRateLimit(key, 2, 60_000);
    const second = await checkRateLimit(key, 2, 60_000);
    const third = await checkRateLimit(key, 2, 60_000);

    expect(first.allowed).toBe(true);
    expect(first.backend).toBe("memory");
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window expires", async () => {
    const key = `test-window-${Math.random()}`;
    expect((await checkRateLimit(key, 1, 1_000)).allowed).toBe(true);
    expect((await checkRateLimit(key, 1, 1_000)).allowed).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect((await checkRateLimit(key, 1, 1_000)).allowed).toBe(true);
  });

  it("keeps separate scopes independent", async () => {
    const first = `test-a-${Math.random()}`;
    const second = `test-b-${Math.random()}`;
    expect((await checkRateLimit(first, 1, 60_000)).allowed).toBe(true);
    expect((await checkRateLimit(first, 1, 60_000)).allowed).toBe(false);
    expect((await checkRateLimit(second, 1, 60_000)).allowed).toBe(true);
  });
});

describe("checkFormRateLimits", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-25T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("caps repeated submissions for the same email inside the window", async () => {
    let result = await checkFormRateLimits("contact", "198.51.100.7", "person@example.com");
    for (let index = 1; index <= FORM_RATE_LIMITS.emailLimit; index += 1) {
      expect(result.allowed).toBe(true);
      result = await checkFormRateLimits("contact", "198.51.100.7", "person@example.com");
    }

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("caps the IP independently of the email address", async () => {
    for (let index = 0; index < FORM_RATE_LIMITS.ipLimit; index += 1) {
      const result = await checkFormRateLimits(
        "contact",
        "198.51.100.8",
        `person${index}@example.com`,
      );
      expect(result.allowed).toBe(true);
    }

    const blocked = await checkFormRateLimits(
      "contact",
      "198.51.100.8",
      "another@example.com",
    );
    expect(blocked.allowed).toBe(false);
  });
});
