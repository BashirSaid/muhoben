import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// في بيئات فيها Chromium مثبّت مسبقًا يمكن تحديد مساره عبر CHROMIUM_PATH
const preinstalled = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const launchOptions = existsSync(preinstalled) ? { executablePath: preinstalled } : {};

// لاختبار نسخة مبنية بمسار فرعي (مثل GitHub Pages): BASE_PATH=/muhoben
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") ?? "";

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:4173${basePath}/`,
    locale: "ar",
    launchOptions,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    command: "node scripts/serve-out.mjs",
    env: { PORT: "4173", BASE_PATH: basePath },
    url: `http://localhost:4173${basePath}/`,
    reuseExistingServer: true,
  },
});
