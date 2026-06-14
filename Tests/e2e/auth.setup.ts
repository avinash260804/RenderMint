import { expect, test as setup } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const USER_A_EMAIL = process.env.TEST_USER_A_EMAIL ?? "usera@atelier.test";
const USER_B_EMAIL = process.env.TEST_USER_B_EMAIL ?? "userb@atelier.test";
const USER_A_TOKEN = process.env.TEST_USER_A_TOKEN ?? "test-user-a-token";
const USER_B_TOKEN = process.env.TEST_USER_B_TOKEN ?? "test-user-b-token";

const AUTH_DIR = path.resolve(__dirname, ".auth");

setup.beforeAll(() => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
});

async function prepareMagicLinkState(
  email: string,
  token: string,
  storageStatePath: string,
  page: import("@playwright/test").Page,
) {
  const appUrl = new URL(BASE_URL);

  await page.goto(`${BASE_URL}/login`);
  const emailInput = page.getByLabel(/email/i);

  await expect(emailInput).toBeVisible();
  await expect(page.getByLabel(/password/i)).toHaveCount(0);

  await emailInput.fill(email);
  await page.getByRole("button", { name: /send magic link|sign in|log in|login/i }).click();

  await page.context().addCookies([
    {
      name: "sb-access-token",
      value: token,
      domain: appUrl.hostname,
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 60 * 60,
      httpOnly: false,
      secure: appUrl.protocol === "https:",
      sameSite: "Lax",
    },
  ]);

  await page.context().storageState({ path: storageStatePath });

  const authCookie = `sb-access-token=${token}`;
  fs.writeFileSync(storageStatePath.replace(".json", "-cookie.txt"), authCookie, "utf-8");
}

setup("authenticate as User A", async ({ page }) => {
  await prepareMagicLinkState(USER_A_EMAIL, USER_A_TOKEN, path.join(AUTH_DIR, "user-a.json"), page);
});

setup("authenticate as User B", async ({ page }) => {
  await prepareMagicLinkState(USER_B_EMAIL, USER_B_TOKEN, path.join(AUTH_DIR, "user-b.json"), page);
});
