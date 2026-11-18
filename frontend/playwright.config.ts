import { defineConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Run the real backend with `cd backend && npm run demo`, and the frontend
// with `cd frontend && npm run dev` before these tests.
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
});
