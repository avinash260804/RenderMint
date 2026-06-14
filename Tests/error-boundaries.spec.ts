// =============================================================================
// DESIGNERS HUB - E2E Error Boundary and Edge Case Tests
// Tool: Playwright
// =============================================================================

import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function expectVisibleNotFound(page: Page, responseStatus?: number) {
  if (responseStatus === 404) return;

  await expect(
    page.locator("h1, h2").filter({ hasText: /404|could not be found|not found/i }).first(),
  ).toBeVisible();
}

async function expectUsablePage(page: Page) {
  const bodyText = await page.locator("body").textContent();
  expect((bodyText ?? "").trim().length).toBeGreaterThan(50);
  await expect(page.locator("body")).not.toContainText(
    /TypeError:|ReferenceError:|Cannot read properties/i,
  );
}

test("EB-01: unknown thread renders a graceful not-found state", async ({ page }) => {
  const response = await page.goto(
    `${BASE_URL}/thread/this-slug-absolutely-does-not-exist-xyzzy999`,
  );

  await expectVisibleNotFound(page, response?.status());
});

test("EB-02: unknown profile renders a graceful not-found state", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/profile/nobody123abc_definitely_not_real`);
  await expectVisibleNotFound(page, response?.status());
});

test("EB-03: unknown discipline renders a graceful not-found state", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/nonexistent-discipline-xyz-atelier-test`);
  await expectVisibleNotFound(page, response?.status());
});

test("EB-04: API failure leaves the community shell usable", async ({ page }) => {
  await page.route("**/api/posts**", (route) => {
    route.fulfill({ status: 500, body: JSON.stringify({ error: "Internal Server Error" }) });
  });

  await page.goto(`${BASE_URL}/architecture`);
  await expectUsablePage(page);
  await expect(page.getByRole("heading", { name: /architecture hub/i })).toBeVisible();
});

test.skip("EB-05: network failure on vote reverts optimistic update", async () => {
  // Deferred: vote controls are not currently exposed in the rendered thread UI.
});

test("EB-06: comments API failure does not blank the thread", async ({ page }) => {
  await page.route("**/api/comments**", (route) => route.abort("failed"));
  await page.goto(`${BASE_URL}/thread/best-workflow-architecture-presentations-2026`);

  await expectUsablePage(page);
  await expect(page.getByTestId("comments-panel")).toBeVisible();
});

test.skip("EB-07: deleted post accessed mid-session renders not-found", async () => {
  // Deferred: requires a seeded deletable DB post and authenticated delete flow.
});

test("EB-08: feed page remains usable when post APIs fail", async ({ page }) => {
  await page.route("**/api/posts**", (route) => route.abort("failed"));
  await page.goto(`${BASE_URL}/architecture`);

  await expectUsablePage(page);
  await expect(page.getByTestId("post-card").first()).toBeVisible();
});

test.skip("EB-09: profile edit save failure preserves form data", async () => {
  // Deferred: profile edit UI is not currently implemented.
});

test("EB-10: search API timeout leaves search page usable", async ({ page }) => {
  await page.route("**/api/search**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 15_000));
    await route.abort("timedout");
  });

  await page.goto(`${BASE_URL}/search?q=design`);
  await page.waitForTimeout(3000);

  await expectUsablePage(page);
  await expect(page.getByRole("heading", { name: /search results/i })).toBeVisible();
});

test("EB-11: malformed thread slug does not produce a server error", async ({ page }) => {
  const encoded = encodeURIComponent("'; DROP TABLE posts;--");
  const response = await page.goto(`${BASE_URL}/thread/${encoded}`);
  const bodyText = await page.locator("body").textContent();

  expect(response?.status()).not.toBe(500);
  expect(bodyText).not.toMatch(/SQL|syntax error|database error|pg_error/i);
  await expectVisibleNotFound(page, response?.status());
});

test("EB-12: empty search state renders gracefully", async ({ page }) => {
  await page.goto(`${BASE_URL}/search?q=xyzzy123notarealtermatelier`);

  await expectUsablePage(page);
  await expect(page.getByTestId("empty-search")).toBeVisible();
});
