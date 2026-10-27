import { defineConfig, devices } from '@playwright/test'

// BASE_URL runs the tests against a deployed portal (GitHub Pages) instead of a local build.
const { BASE_URL } = process.env
const LOCAL_URL = 'http://localhost:3100/'

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: BASE_URL ?? LOCAL_URL },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start -- -p 3100',
        url: `${LOCAL_URL}home`,
        reuseExistingServer: true,
        timeout: 300_000,
      },
})
