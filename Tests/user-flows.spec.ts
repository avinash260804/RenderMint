import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const USER_A_EMAIL = process.env.TEST_USER_A_EMAIL ?? "usera@atelier.test";
const SEEDED_DISCIPLINE = process.env.TEST_DISCIPLINE ?? "architecture";
const SEEDED_POST_SLUG = "best-workflow-architecture-presentations-2026";

async function expectPostCards(page: Page) {
  await expect(page.getByTestId("post-card").first()).toBeVisible();
}

async function openCreatePost(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(`${BASE_URL}/post/new`);
  await expect(page.getByRole("heading", { name: /compose a new thread/i })).toBeVisible();
  await expect(page.getByLabel(/post type/i)).toBeVisible();
}

test.describe("Auth and Onboarding Contract", () => {
  test("E-01 login exposes Magic Link auth, not password auth", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send magic link/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toHaveCount(0);
  });

  test("E-02 signup exposes account creation through Magic Link", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toHaveCount(0);
  });

  test("E-03 login accepts an email and stays on the auth surface", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/email/i).fill(USER_A_EMAIL);
    await expect(page.getByLabel(/email/i)).toHaveValue(USER_A_EMAIL);
    await expect(page).toHaveURL(/\/login/);
  });

  test("E-04 protected onboarding redirects anonymous visitors to login", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/onboarding`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("E-05 authenticated test state includes the expected auth cookie", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const cookies = await page.context().cookies(BASE_URL);
    expect(cookies.some((cookie) => cookie.name === "sb-access-token")).toBe(true);
  });
});

test.describe("Community Navigation", () => {
  test("E-06 home page renders the Designers Hub community promise", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole("heading", { name: /designers discuss/i })).toBeVisible();
    await expectPostCards(page);
  });

  test("E-07 explore page renders discipline discovery cards", async ({ page }) => {
    await page.goto(`${BASE_URL}/explore`);
    await expect(page.getByTestId("discipline-card").first()).toBeVisible();
    await expect(page.getByText(/Architecture|Interior Design|Urban Design/).first()).toBeVisible();
  });

  test("E-08 architecture hub renders active threads", async ({ page }) => {
    await page.goto(`${BASE_URL}/architecture`);
    await expect(page.getByRole("heading", { name: /architecture hub/i })).toBeVisible();
    await expectPostCards(page);
  });

  test("E-09 interior design hub renders discipline context", async ({ page }) => {
    await page.goto(`${BASE_URL}/interior-design`);
    await expect(page.getByRole("heading", { name: /interior design hub/i })).toBeVisible();
    await expect(page.getByText(/interior concepts, detailing, visualization/i)).toBeVisible();
  });

  test("E-10 urban design hub renders discipline context", async ({ page }) => {
    await page.goto(`${BASE_URL}/urban-design`);
    await expect(page.getByRole("heading", { name: /urban design hub/i })).toBeVisible();
    await expect(page.getByText(/urban systems, public space, mobility/i)).toBeVisible();
  });
});

test.describe("Discipline Spaces", () => {
  test("E-11 discussions space shows discussion cards", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SEEDED_DISCIPLINE}/discussions`);
    await expect(page.getByRole("heading", { name: /discussions/i })).toBeVisible();
    await expect(page.getByTestId("post-card").first()).toHaveAttribute("data-post-type", "discussion");
  });

  test("E-12 critique space is reachable", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SEEDED_DISCIPLINE}/critique`);
    await expect(page.getByRole("heading", { name: /critique/i })).toBeVisible();
  });

  test("E-13 showcase space is reachable", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SEEDED_DISCIPLINE}/showcase`);
    await expect(page.getByRole("heading", { name: /showcase/i })).toBeVisible();
  });

  test("E-14 help space renders help cards or empty help state", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SEEDED_DISCIPLINE}/help`);
    await expect(page.getByRole("heading", { name: /help/i })).toBeVisible();
    await expect(page.getByTestId("post-card").first().or(page.getByText(/no help threads/i))).toBeVisible();
  });

  test("E-15 resources space renders resource cards or empty resource state", async ({ page }) => {
    await page.goto(`${BASE_URL}/${SEEDED_DISCIPLINE}/resources`);
    await expect(page.getByRole("heading", { name: /resources/i })).toBeVisible();
    await expect(page.getByTestId("post-card").first().or(page.getByText(/no resources/i))).toBeVisible();
  });
});

test.describe("Post Creation UX", () => {
  test("E-16 create post page uses the canonical /post/new route", async ({ page }) => {
    await openCreatePost(page);
    await expect(page.getByText(/dynamic form/i)).toBeVisible();
  });

  test("E-17 discussion validation requires a meaningful body", async ({ page }) => {
    await openCreatePost(page);
    await page.getByLabel(/title/i).fill("Short discussion title");
    await page.getByRole("button", { name: /validate/i }).click();
    await expect(page.getByText(/invalid input|body/i).first()).toBeVisible();
  });

  test("E-18 preview mode shows entered discussion content", async ({ page }) => {
    await openCreatePost(page);
    await page.getByLabel(/title/i).fill("Preview discussion title");
    await page.getByLabel(/body/i).fill("This discussion body is long enough for preview mode.");
    await expect(page.getByLabel(/title/i)).toHaveValue("Preview discussion title");
    await expect(page.getByLabel(/body/i)).toHaveValue(
      "This discussion body is long enough for preview mode.",
    );
    await page.getByRole("button", { name: /^preview$/i }).click();
    await expect(page.getByText("Preview discussion title")).toBeVisible();
    await expect(page.getByText(/long enough for preview mode/i)).toBeVisible();
  });

  test("E-19 critique type reveals critique-specific fields", async ({ page }) => {
    await openCreatePost(page);
    await page.getByLabel(/post type/i).selectOption("critique");
    await expect(page.getByLabel(/context/i)).toBeVisible();
    await expect(page.getByLabel(/project description/i)).toBeVisible();
    await expect(page.getByLabel(/challenge statement/i)).toBeVisible();
  });

  test("E-20 help type requires software and issue context", async ({ page }) => {
    await openCreatePost(page);
    await page.getByLabel(/post type/i).selectOption("help");
    await expect(page.getByLabel(/software/i)).toBeVisible();
    await expect(page.getByLabel(/issue description/i)).toBeVisible();
  });
});

test.describe("Thread and SEO Surfaces", () => {
  test("E-21 seeded thread renders SSR title content", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/thread/${SEEDED_POST_SLUG}`);
    const html = await response?.text();
    expect(html ?? "").toMatch(/Best workflow for architecture presentations in 2026/i);
    await expect(
      page.getByRole("heading", { name: /best workflow for architecture presentations/i }),
    ).toBeVisible();
  });

  test("E-22 help thread exposes solved state when available", async ({ page }) => {
    await page.goto(`${BASE_URL}/thread/revit-family-constraints-break-during-nested-load`);
    await expect(page.getByText(/revit family constraints/i)).toBeVisible();
    await expect(page.getByText(/solved/i).first()).toBeVisible();
  });

  test("E-23 unknown thread returns a not found experience", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/thread/this-thread-does-not-exist-xyzzy`);
    if (response?.status() !== 404) {
      await expect(
        page.locator("h1, h2").filter({ hasText: /404|could not be found/i }).first(),
      ).toBeVisible();
    }
  });

  test("E-24 comments panel or empty comment state renders on a thread", async ({ page }) => {
    await page.goto(`${BASE_URL}/thread/${SEEDED_POST_SLUG}`);
    await expect(page.getByTestId("comments-panel")).toBeVisible();
  });
});

test.describe("Search and Discovery", () => {
  test("E-25 /search accepts query params and renders matching results", async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=design`);
    await expect(page.getByTestId("search-results")).toBeVisible();
  });

  test("E-26 search with discipline filter keeps results scoped", async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=design&discipline=architecture`);
    await expect(page.getByLabel(/search/i).or(page.locator("input").first())).toBeVisible();
    const firstDiscipline = page.getByTestId("discipline-label").first();
    if (await firstDiscipline.isVisible().catch(() => false)) {
      await expect(firstDiscipline).toHaveText(/architecture/i);
    }
  });

  test("E-27 search with no matches shows an empty state", async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=xyzzy123notarealtermatelier`);
    await expect(page.getByTestId("empty-search")).toBeVisible();
  });

  test("E-28 search remains accessible without auth", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/search?q=design`);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /search results/i })).toBeVisible();
  });

  test("E-29 post cards link through to canonical thread URLs", async ({ page }) => {
    await page.goto(`${BASE_URL}/architecture`);
    const firstCard = page.getByTestId("post-card").first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.locator("a[href^='/thread/']").first().getAttribute("href");
    expect(href).toMatch(/^\/thread\//);
  });

  test("E-30 robots and sitemap routes are reachable", async ({ page }) => {
    const robots = await page.goto(`${BASE_URL}/robots.txt`);
    expect(robots?.status()).toBe(200);
    const sitemap = await page.goto(`${BASE_URL}/sitemap.xml`);
    expect(sitemap?.status()).toBe(200);
  });
});
