import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("cynbit_newsletter_seen", "1");
  });
});

test.describe("newsletter dialog", () => {
  test("opens from the footer, submits and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Newsletter" }).click();

    const dialog = page.getByRole("dialog", { name: "One useful idea, once a month." });
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(2_700);

    await page.locator("#newsletter-email").fill("playwright-newsletter@example.com");
    await page.locator("#newsletter-consent").check();
    await page.getByRole("button", { name: "Join the list" }).click();

    await expect(dialog.getByRole("status")).toContainText("Received.", { timeout: 15_000 });
    await expect(dialog.getByRole("status")).toContainText("Demo mode");

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("mobile navigation @mobile", () => {
  test("opens the dialog menu and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
  });
});

test.describe("contact experience @desktop", () => {
  test("accordion expands natively", async ({ page }) => {
    await page.goto("/contact");
    const first = page.locator("details").first();
    await expect(first).not.toHaveAttribute("open");
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open");
  });

  test("validates on the server, then accepts a complete inquiry", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(2_700);

    await page.getByRole("button", { name: "Send inquiry" }).click();
    const formAlert = page.getByRole("alert").filter({ hasText: "Please check" });
    await expect(formAlert).toBeVisible();
    await expect(page.getByText("Enter your name.")).toBeVisible();

    await page.locator("#contact-name").fill("Playwright Reviewer");
    await page.locator("#contact-email").fill("playwright-contact@example.com");
    await page.locator("#contact-company").fill("Quality Desk");
    await page.locator("#contact-message").fill(
      "Checking the rebuilt contact flow end to end on a local production build.",
    );
    await page.locator("#contact-consent").check();
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("status")).toContainText("Received.", { timeout: 15_000 });
    await expect(page.getByRole("status")).toContainText("Demo mode");
  });
});

test.describe("career application @desktop", () => {
  test("accepts a valid application in demo transport", async ({ page }) => {
    await page.goto("/careers/ai-engineer");
    await page.waitForTimeout(2_700);

    await page.locator("#career-name").fill("Playwright Candidate");
    await page.locator("#career-email").fill("playwright-career@example.com");
    await page.locator("#career-portfolio").fill("https://example.com/portfolio");
    await page.locator("#career-message").fill(
      "A short end-to-end check of the rebuilt application flow against a local build.",
    );
    await page.locator("#career-consent").check();
    await page.getByRole("button", { name: "Send application" }).click();

    await expect(page.getByRole("status")).toContainText("Received.", { timeout: 15_000 });
    await expect(page.getByRole("status")).toContainText("Demo mode");
  });
});

test.describe("error handling @desktop", () => {
  test("unknown routes return the branded 404", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-real-page");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "This page took a different route." }),
    ).toBeVisible();
  });
});
