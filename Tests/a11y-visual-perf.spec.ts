// =============================================================================
// DESIGNERS HUB - Accessibility, Visual, and Performance Tests
// Tool: Playwright + @axe-core/playwright
// =============================================================================

import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SEEDED_THREAD_SLUG = "best-workflow-architecture-presentations-2026";
const RUN_VISUAL_TESTS = process.env.RUN_VISUAL_TESTS === "true";

async function checkA11y(page: Page, url: string) {
  await page.goto(url);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toHaveLength(0);
}

test.describe("Accessibility - WCAG 2.1 AA", () => {
  test("A11Y-01: Home page has no WCAG 2.1 AA violations", async ({ page }) => {
    await checkA11y(page, "/");
  });

  test("A11Y-02: Login page has labelled Magic Link form controls", async ({ page }) => {
    await checkA11y(page, "/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
  });

  test("A11Y-03: Architecture hub exposes the main landmark", async ({ page }) => {
    await checkA11y(page, "/architecture");
    await expect(page.locator("main")).toBeVisible();
  });

  test("A11Y-04: Thread page exposes comments as a list region", async ({ page }) => {
    await checkA11y(page, `/thread/${SEEDED_THREAD_SLUG}`);
    const commentList = page.getByTestId("comment-list");
    await expect(commentList).toBeVisible();
    await expect(commentList).toHaveAttribute("role", "list");
  });

  test("A11Y-05: Explore page has accessible headings and cards", async ({ page }) => {
    await checkA11y(page, "/explore");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByTestId("discipline-card").first()).toBeVisible();
  });

  test("A11Y-06: Post creation form controls are labelled", async ({ page }) => {
    await checkA11y(page, "/post/new");
    await expect(page.getByLabel(/post type/i)).toBeVisible();
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/body/i)).toBeVisible();
  });

  test("A11Y-07: Search page filters and search input are labelled", async ({ page }) => {
    await checkA11y(page, "/search");
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByLabel(/discipline filter/i)).toBeVisible();
    await expect(page.getByLabel(/software filter/i)).toBeVisible();
    await expect(page.getByLabel(/post type filter/i)).toBeVisible();
    await expect(page.getByLabel(/solved state filter/i)).toBeVisible();
  });

  test("A11Y-08: Not-found page exposes accessible error messaging", async ({ page }) => {
    await page.goto("/this-page-will-never-exist-a11y08");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toHaveLength(0);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe(RUN_VISUAL_TESTS ? "Visual Regression" : "Visual Regression - deferred", () => {
  test.skip(!RUN_VISUAL_TESTS, "Visual baselines have not been approved for this workspace yet.");
  test.use({ viewport: { width: 1440, height: 900 } });

  test("VR-01: Home page desktop baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-desktop.png", { maxDiffPixelRatio: 0.02 });
  });

  test("VR-02: Home page mobile baseline", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-mobile.png", { maxDiffPixelRatio: 0.02 });
    await ctx.close();
  });

  test("VR-03: Architecture hub desktop baseline", async ({ page }) => {
    await page.goto("/architecture");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("architecture-desktop.png", { maxDiffPixelRatio: 0.02 });
  });

  test("VR-04: Thread page desktop baseline", async ({ page }) => {
    await page.goto(`/thread/${SEEDED_THREAD_SLUG}`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("thread-desktop.png", { maxDiffPixelRatio: 0.02 });
  });

  test("VR-05: Explore page desktop baseline", async ({ page }) => {
    await page.goto("/explore");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("explore-desktop.png", { maxDiffPixelRatio: 0.02 });
  });

  test("VR-06: Post creation form desktop baseline", async ({ page }) => {
    await page.goto("/post/new");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("post-create-empty.png", { maxDiffPixelRatio: 0.02 });
  });
});

test.describe("Performance - Web Vitals", () => {
  async function measureWebVitals(page: Page, url: string) {
    await page.goto(url, { waitUntil: "networkidle" });
    return page.evaluate(() => {
      return new Promise<Record<string, number>>((resolve) => {
        const vitals: Record<string, number> = {};
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") vitals.lcp = entry.startTime;
            if (entry.entryType === "layout-shift") {
              vitals.cls = (vitals.cls ?? 0) + (entry as PerformanceEntry & { value: number }).value;
            }
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "layout-shift") {
              vitals.cls = (vitals.cls ?? 0) + (entry as PerformanceEntry & { value: number }).value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve(vitals), 3000);
      });
    });
  }

  test("PERF-01: Home page LCP < 2.5s", async ({ page }) => {
    const vitals = await measureWebVitals(page, "/");
    expect(vitals.lcp ?? 0).toBeLessThan(2500);
  });

  test("PERF-02: Home page CLS < 0.1", async ({ page }) => {
    const vitals = await measureWebVitals(page, "/");
    expect(vitals.cls ?? 0).toBeLessThan(0.1);
  });

  test("PERF-03: Architecture hub LCP < 2.5s", async ({ page }) => {
    const vitals = await measureWebVitals(page, "/architecture");
    expect(vitals.lcp ?? 0).toBeLessThan(2500);
  });

  test("PERF-04: Thread page LCP < 2.5s", async ({ page }) => {
    const vitals = await measureWebVitals(page, `/thread/${SEEDED_THREAD_SLUG}`);
    expect(vitals.lcp ?? 0).toBeLessThan(2500);
  });

  test("PERF-05: Search page first result visible < 1s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/search?q=design");
    await page.locator("[data-testid=post-card]").first().waitFor({ state: "visible" });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000);
  });

  test("PERF-06: Home page has no console.error on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});
