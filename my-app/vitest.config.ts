import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    browser: {
      enabled: true,
      name: "chromium",
      headless: false,
    },
    globals: true,
    setupFiles: "./src/setupTests.ts",
    include: ["**/__tests__/*.{test,spec}.{ts,tsx}"], // looks inside __tests__/
  },
});
