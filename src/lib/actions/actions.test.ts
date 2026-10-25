import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialFormState } from "@/lib/forms";
import { resetRateLimitsForTests } from "@/lib/rate-limit";

const { headersMock, sendFormEmailMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
  sendFormEmailMock: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: headersMock }));
vi.mock("@/lib/email", () => ({ sendFormEmail: sendFormEmailMock }));

import { submitCareerApplication } from "@/lib/actions/careers";
import { submitContact } from "@/lib/actions/contact";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

let requestNumber = 0;

beforeEach(() => {
  resetRateLimitsForTests();
  requestNumber += 1;
  headersMock.mockResolvedValue(
    new Headers({ "x-forwarded-for": `203.0.113.${requestNumber}` }),
  );
  sendFormEmailMock.mockReset();
  sendFormEmailMock.mockResolvedValue({ ok: true, transport: "demo" });
});

function contactForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const fields = {
    name: "Rahul Sain",
    email: "rahul@example.com",
    company: "Cynbit",
    interest: "project",
    message: "We need a careful rebuild of a content-heavy public website.",
    consent: "yes",
    startedAt: String(Date.now() - 5_000),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function careerForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const fields = {
    role: "ai-engineer",
    name: "Rahul Sain",
    email: "rahul@example.com",
    location: "Jaipur",
    portfolio: "https://github.com/example",
    linkedin: "",
    message: "I have built production AI systems and want to work on autonomous agents.",
    consent: "yes",
    startedAt: String(Date.now() - 5_000),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function newsletterForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const fields = {
    email: "reader@example.com",
    consent: "yes",
    startedAt: String(Date.now() - 5_000),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("submitContact", () => {
  it("returns field errors without attempting delivery", async () => {
    const result = await submitContact(
      initialFormState,
      contactForm({ email: "not-an-email", message: "Hi" }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(result.fieldErrors?.message).toBeTruthy();
    expect(result.reference).toBeTruthy();
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("rejects a submission that arrives too quickly", async () => {
    const result = await submitContact(
      initialFormState,
      contactForm({ startedAt: String(Date.now()) }),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("take a moment");
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("silently drops a honeypot submission", async () => {
    const result = await submitContact(initialFormState, contactForm({ website: "spam" }));

    expect(result.status).toBe("success");
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("delivers a valid inquiry and uses the sender as reply-to", async () => {
    const result = await submitContact(initialFormState, contactForm());

    expect(result.status).toBe("success");
    expect(result.transport).toBe("demo");
    expect(result.reference).toBeTruthy();
    expect(sendFormEmailMock).toHaveBeenCalledOnce();
    expect(sendFormEmailMock.mock.calls[0][0]).toMatchObject({
      kind: "contact",
      replyTo: "rahul@example.com",
    });
  });

  it("does not claim success when delivery is unavailable", async () => {
    sendFormEmailMock.mockResolvedValue({ ok: false, reason: "not_configured" });
    const result = await submitContact(initialFormState, contactForm());

    expect(result.status).toBe("error");
    expect(result.message).toContain("not available");
    expect(result.reference).toBeTruthy();
  });

  it("enforces five submissions per IP in ten minutes", async () => {
    for (let index = 0; index < 5; index += 1) {
      const result = await submitContact(
        initialFormState,
        contactForm({ email: `person${index}@example.com` }),
      );
      expect(result.status).toBe("success");
    }

    const blocked = await submitContact(
      initialFormState,
      contactForm({ email: "person-6@example.com" }),
    );

    expect(blocked.status).toBe("error");
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(sendFormEmailMock).toHaveBeenCalledTimes(5);
  });
});

describe("submitCareerApplication", () => {
  it("rejects a role that is not open", async () => {
    const result = await submitCareerApplication(
      initialFormState,
      careerForm({ role: "chief-vibes-officer" }),
    );

    expect(result.status).toBe("error");
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("silently drops a honeypot application", async () => {
    const result = await submitCareerApplication(
      initialFormState,
      careerForm({ website: "spam" }),
    );

    expect(result.status).toBe("success");
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("delivers a valid application to the team mailbox", async () => {
    const result = await submitCareerApplication(initialFormState, careerForm());

    expect(result.status).toBe("success");
    expect(sendFormEmailMock).toHaveBeenCalledOnce();
    expect(sendFormEmailMock.mock.calls[0][0].subject).toContain("AI Engineer");
    expect(sendFormEmailMock.mock.calls[0][0].kind).toBe("career");
  });
});

describe("subscribeToNewsletter", () => {
  it("validates the email and consent", async () => {
    const result = await subscribeToNewsletter(
      initialFormState,
      newsletterForm({ email: "nope", consent: "" }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(result.fieldErrors?.consent).toBeTruthy();
    expect(sendFormEmailMock).not.toHaveBeenCalled();
  });

  it("subscribes a valid address", async () => {
    const result = await subscribeToNewsletter(initialFormState, newsletterForm());

    expect(result.status).toBe("success");
    expect(sendFormEmailMock).toHaveBeenCalledOnce();
    expect(sendFormEmailMock.mock.calls[0][0].kind).toBe("newsletter");
  });

  it("caps repeated sign-ups for the same address", async () => {
    for (let index = 0; index < 3; index += 1) {
      const result = await subscribeToNewsletter(initialFormState, newsletterForm());
      expect(result.status).toBe("success");
    }

    const blocked = await subscribeToNewsletter(initialFormState, newsletterForm());
    expect(blocked.status).toBe("error");
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
