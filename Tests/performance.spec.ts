// =============================================================================
// DESIGNERS HUB - Dedicated Performance Tests
// Tool: Playwright
// =============================================================================

import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SEEDED_SLUG = "best-workflow-architecture-presentations-2026";

const LCP_THRESHOLD = Number.parseInt(process.env.PERF_LCP_MS ?? "2500", 10);
const CLS_THRESHOLD = Number.parseFloat(process.env.PERF_CLS ?? "0.1");
const FIRST_RESULT_THRESHOLD = Number.parseInt(process.env.PERF_FIRST_RESULT_MS ?? "2000", 10);

async function collectWebVitals(page: Page): Promise<{ lcp: number; cls: number }> {
  await page.waitForLoadState("networkidle");

  return page.evaluate((): Promise<{ lcp: number; cls: number }> => {
    return new Promise((resolve) => {
      let lcpValue = 0;
      let clsValue = 0;

      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          lcpValue =
            (entry as PerformanceEntry & { renderTime?: number; loadTime?: number }).renderTime ||
            (entry as PerformanceEntry & { loadTime?: number }).loadTime ||
            entry.startTime;
        }
      });

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value ?? 0;
          }
        }
      });

      try {
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch {
        // Older browser engines may not support every performance entry type.
      }

      setTimeout(() => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        resolve({ lcp: lcpValue, cls: clsValue });
      }, 3000);
    });
  });
}

test("PERF-01: Home page LCP < 2500ms", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "load" });
  const { lcp } = await collectWebVitals(page);
  expect(lcp, `Home LCP ${lcp}ms exceeds ${LCP_THRESHOLD}ms`).toBeLessThan(LCP_THRESHOLD);
});

test("PERF-02: Home page CLS < 0.1", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "load" });
  const { cls } = await collectWebVitals(page);
  expect(cls, `Home CLS ${cls} exceeds ${CLS_THRESHOLD}`).toBeLessThan(CLS_THRESHOLD);
});

test("PERF-03: Architecture hub LCP < 2500ms", async ({ page }) => {
  await page.goto(`${BASE_URL}/architecture`, { waitUntil: "load" });
  const { lcp } = await collectWebVitals(page);
  expect(lcp, `Architecture LCP ${lcp}ms exceeds ${LCP_THRESHOLD}ms`).toBeLessThan(
    LCP_THRESHOLD,
  );
});

test("PERF-04: Thread page LCP < 2500ms", async ({ page }) => {
  await page.goto(`${BASE_URL}/thread/${SEEDED_SLUG}`, { waitUntil: "load" });
  const { lcp } = await collectWebVitals(page);
  expect(lcp, `Thread LCP ${lcp}ms exceeds ${LCP_THRESHOLD}ms`).toBeLessThan(LCP_THRESHOLD);
});

test("PERF-05: Search page first result visible within local-dev budget", async ({ page }) => {
  const startTime = Date.now();

  await page.goto(`${BASE_URL}/search?q=design`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="post-card"]', {
    timeout: FIRST_RESULT_THRESHOLD + 2000,
  });

  const elapsed = Date.now() - startTime;
  expect(
    elapsed,
    `First result took ${elapsed}ms, threshold is ${FIRST_RESULT_THRESHOLD}ms`,
  ).toBeLessThan(FIRST_RESULT_THRESHOLD);
});

test("PERF-06: Key pages have no console.error on load", async ({ page }) => {
  const pages = [
    BASE_URL,
    `${BASE_URL}/login`,
    `${BASE_URL}/thread/${SEEDED_SLUG}`,
    `${BASE_URL}/search?q=design`,
    `${BASE_URL}/explore`,
  ];

  const allErrors: Array<{ url: string; errors: string[] }> = [];

  for (const url of pages) {
    const errors: string[] = [];
    const handler = (msg: ConsoleMessage) => {
      if (msg.type() === "error") errors.push(msg.text());
    };
    const errHandler = (err: Error) => errors.push(`[pageerror] ${err.message}`);

    page.on("console", handler);
    page.on("pageerror", errHandler);
    await page.goto(url, { waitUntil: "networkidle" });
    page.off("console", handler);
    page.off("pageerror", errHandler);

    if (errors.length > 0) {
      allErrors.push({ url, errors });
    }
  }

  expect(allErrors).toHaveLength(0);
});
