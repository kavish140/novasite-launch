import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND || 'npm run dev -- --host 127.0.0.1 --port 8080 --strictPort',
    timeout: 120000,
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
  },
});
