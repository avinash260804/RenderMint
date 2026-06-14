import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const STORAGE_STATE_USER_A = path.resolve(__dirname, "tests/e2e/.auth/user-a.json");
const STORAGE_STATE_USER_B = path.resolve(__dirname, "tests/e2e/.auth/user-b.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  timeout: 60_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  snapshotDir: "tests/visual/__snapshots__",
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 500,
      threshold: 0.02,
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "security",
      testDir: "./tests/e2e/security",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
    {
      name: "e2e-flows",
      testDir: "./tests/e2e/flows",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
    {
      name: "e2e-errors",
      testDir: "./tests/e2e/errors",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
    {
      name: "accessibility",
      testDir: "./tests/e2e/accessibility",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
    {
      name: "visual",
      testDir: "./tests/visual",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_USER_A,
        launchOptions: { args: ["--font-render-hinting=none", "--disable-font-subpixel-positioning"] },
      },
    },
    {
      name: "performance",
      testDir: "./tests/e2e/performance",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
    {
      name: "smoke",
      testDir: "./tests/e2e/smoke",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE_USER_A },
    },
  ],
});
