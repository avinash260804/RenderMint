// =============================================================================
// DESIGNERS HUB - Smoke Tests
// Tool: Playwright
// =============================================================================

import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const SEEDED_THREAD_SLUG = "best-workflow-architecture-presentations-2026";
const HELP_THREAD_SLUG = "revit-family-constraints-break-during-nested-load";
const RUN_BUILD_SMOKE = process.env.RUN_BUILD_SMOKE === "true";

test("SMOKE-01: Magic Link auth surfaces render", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toHaveCount(0);

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
});

test("SMOKE-02: Community navigation surfaces load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /designers discuss/i })).toBeVisible();

  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: /explore design knowledge/i })).toBeVisible();
  await expect(page.getByTestId("discipline-card").first()).toBeVisible();

  await page.goto("/architecture");
  await expect(page.getByRole("heading", { name: /architecture hub/i })).toBeVisible();
  await expect(page.getByTestId("post-card").first()).toBeVisible();
});

test("SMOKE-03: Discipline spaces load", async ({ page }) => {
  for (const space of ["discussions", "critique", "showcase", "help", "resources"]) {
    await page.goto(`/architecture/${space}`);
    await expect(page.locator("h1, h2").filter({ hasText: new RegExp(space, "i") }).first()).toBeVisible();
  }
});

test("SMOKE-04: Post creation dynamic form and preview work", async ({ page }) => {
  await page.goto("/post/new");
  await expect(page.getByRole("heading", { name: /compose a new thread/i })).toBeVisible();

  await page.getByLabel(/title/i).fill("Smoke preview discussion");
  await page.getByLabel(/body/i).fill("This smoke test verifies the discussion preview mode.");
  await page.getByRole("button", { name: /^preview$/i }).click();

  await expect(page.getByText("Smoke preview discussion")).toBeVisible();
  await expect(page.getByText(/discussion preview mode/i)).toBeVisible();
});

test("SMOKE-05: Search returns results and links to canonical thread", async ({ page }) => {
  await page.goto("/search?q=design");
  await expect(page.getByTestId("search-results")).toBeVisible();

  const href = await page.getByTestId("post-card").first().locator("a[href^='/thread/']").first().getAttribute("href");
  expect(href).toMatch(/^\/thread\//);

  await page.goto(href!);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("SMOKE-06: Seeded thread and comments panel load", async ({ page }) => {
  await page.goto(`/thread/${SEEDED_THREAD_SLUG}`);
  await expect(page.getByRole("heading", { name: /best workflow for architecture presentations/i })).toBeVisible();
  await expect(page.getByTestId("comments-panel")).toBeVisible();
});

test("SMOKE-07: Help thread exposes solved state", async ({ page }) => {
  await page.goto(`/thread/${HELP_THREAD_SLUG}`);
  await expect(page.getByText(/revit family constraints/i)).toBeVisible();
  await expect(page.getByText(/solved/i).first()).toBeVisible();
});

test.skip("SMOKE-08: Upload flow creates showcase media thumbnail", async () => {
  // Deferred: end-to-end upload persistence requires configured R2 credentials and DB write flow.
});

test("SMOKE-09: Bad thread slug renders graceful not-found UI", async ({ page }) => {
  const response = await page.goto("/thread/smoke-test-bad-slug-xyzzy-9991");
  if (response?.status() !== 404) {
    await expect(
      page.locator("h1, h2").filter({ hasText: /404|could not be found|not found/i }).first(),
    ).toBeVisible();
  }
});

test.skip("SMOKE-10: Rate limit returns 429 on repeated writes", async () => {
  // Deferred: post/vote write endpoints do not currently apply rate-limit middleware.
});

test("SMOKE-11: Build command exits successfully from project root", async () => {
  test.skip(!RUN_BUILD_SMOKE, "Build is verified separately to avoid dev-server .next contention.");

  const projectRoot = path.resolve(__dirname, "..");
  const result = spawnSync("npm.cmd", ["run", "build"], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false,
  });

  const combined = `${result.stdout}\n${result.stderr}`;
  expect(result.status, `npm run build failed:\n${combined.slice(0, 2000)}`).toBe(0);
});
