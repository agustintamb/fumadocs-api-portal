import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:3100'

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start -- -p 3100',
    url: `${baseURL}/home`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
})
