import { describe, expect, it } from "vitest";
import {
  careerApplicationSchema,
  contactSchema,
  isFormTooFast,
  newsletterSchema,
} from "@/lib/validation";

const validContact = {
  name: "Rahul Sain",
  email: "rahul@example.com",
  company: "Cynbit",
  interest: "project",
  message: "We need a careful rebuild of a content-heavy public website.",
  consent: true,
};

const validCareer = {
  role: "ai-engineer",
  name: "Rahul Sain",
  email: "rahul@example.com",
  location: "Jaipur",
  portfolio: "https://github.com/example",
  linkedin: "https://www.linkedin.com/in/example",
  message: "I have built production AI systems and want to work on autonomous agents.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepts a complete inquiry", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects an unknown interest value", () => {
    expect(contactSchema.safeParse({ ...validContact, interest: "crypto" }).success).toBe(false);
  });

  it("rejects an inquiry without consent", () => {
    expect(contactSchema.safeParse({ ...validContact, consent: false }).success).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(contactSchema.safeParse({ ...validContact, admin: true }).success).toBe(false);
  });

  it("rejects a short message", () => {
    expect(contactSchema.safeParse({ ...validContact, message: "Hi" }).success).toBe(false);
  });

  it("normalises the email address", () => {
    const result = contactSchema.safeParse({ ...validContact, email: "  Rahul@Example.COM " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("rahul@example.com");
  });
});

describe("careerApplicationSchema", () => {
  it("accepts a complete application", () => {
    expect(careerApplicationSchema.safeParse(validCareer).success).toBe(true);
  });

  it("requires a full portfolio URL", () => {
    expect(careerApplicationSchema.safeParse({ ...validCareer, portfolio: "github.com/example" }).success).toBe(false);
  });

  it("rejects a non-http portfolio URL", () => {
    expect(careerApplicationSchema.safeParse({ ...validCareer, portfolio: "javascript:alert(1)" }).success).toBe(false);
  });

  it("allows a blank optional LinkedIn link", () => {
    expect(careerApplicationSchema.safeParse({ ...validCareer, linkedin: "" }).success).toBe(true);
  });

  it("rejects an invalid optional LinkedIn link", () => {
    expect(careerApplicationSchema.safeParse({ ...validCareer, linkedin: "linkedin.com/in/example" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid sign-up", () => {
    expect(newsletterSchema.safeParse({ email: "Reader@Example.com", consent: true }).success).toBe(
      true,
    );
  });

  it("rejects unknown fields", () => {
    expect(
      newsletterSchema.safeParse({ email: "reader@example.com", consent: true, admin: true }).success,
    ).toBe(false);
  });

  it("rejects missing consent", () => {
    expect(newsletterSchema.safeParse({ email: "reader@example.com", consent: false }).success).toBe(
      false,
    );
  });
});

describe("isFormTooFast", () => {
  it("rejects a missing timestamp", () => {
    expect(isFormTooFast("")).toBe(true);
  });

  it("rejects a submission sent immediately", () => {
    expect(isFormTooFast(String(Date.now()))).toBe(true);
  });

  it("accepts a submission after the minimum time", () => {
    expect(isFormTooFast(String(Date.now() - 5_000))).toBe(false);
  });
});
