import { defineConfig, devices } from '@playwright/test';

// Inside the DDEV web container the site answers on http://localhost.
const baseURL = process.env.BASE_URL || 'http://localhost';

export default defineConfig({
  testDir: './specs',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /lighthouse\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      testIgnore: /lighthouse\.spec\.js/,
      use: { ...devices['Pixel 7'] },
    },
    {
      // Lighthouse drives its own browser and measures timing, so it runs alone.
      name: 'lighthouse',
      testMatch: /lighthouse\.spec\.js/,
      fullyParallel: false,
      workers: 1,
    },
  ],
});
