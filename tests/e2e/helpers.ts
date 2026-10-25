import { expect, type Page } from "@playwright/test";

export type CspViolation = {
  directive: string;
  blockedURI: string;
};

export async function trackPage(page: Page) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.addInitScript(() => {
    const violations: { directive: string; blockedURI: string }[] = [];
    window.addEventListener("securitypolicyviolation", (event) => {
      violations.push({
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
      });
    });
    Object.assign(window, { __cspViolations: violations });
  });

  return {
    consoleErrors,
    cspViolations: async () =>
      page.evaluate(
        () =>
          (window as unknown as { __cspViolations?: CspViolation[] }).__cspViolations ?? [],
      ),
  };
}

export async function expectCleanPage(page: Page, tracker: Awaited<ReturnType<typeof trackPage>>) {
  const violations = await tracker.cspViolations();
  expect(violations, `CSP violations: ${JSON.stringify(violations)}`).toEqual([]);
  expect(tracker.consoleErrors, `Console errors: ${tracker.consoleErrors.join(" | ")}`).toEqual([]);
}
