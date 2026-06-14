import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "src/**/__tests__/**/*.{test,spec}.{ts,tsx}",
      "src/__tests__/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
      "Tests/integration/**/*.{test,spec}.{ts,tsx}",
      "tests/forms/**/*.{test,spec}.{ts,tsx}",
      "Tests/forms/**/*.{test,spec}.{ts,tsx}",
      "tests/snapshots/**/*.{test,spec}.{ts,tsx}",
      "Tests/snapshots/**/*.{test,spec}.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "tests/**",
        "Tests/**",
        "**/*.config.*",
        "**/*.d.ts",
        "prisma/**",
        ".next/**",
      ],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
    exclude: ["node_modules/**", "tests/e2e/**", "tests/visual/**", "tests/rls/**", ".next/**"],
    testTimeout: 30_000,
    hookTimeout: 15_000,
    reporters: process.env.CI ? ["verbose", "junit"] : ["verbose"],
    outputFile: {
      junit: "./test-results/vitest-junit.xml",
    },
    pool: "forks",
  },
});
