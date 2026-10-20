import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.js', timeout: 120000,
  use: { baseURL: 'http://localhost:5180', channel: 'msedge', headless: true },
  webServer: { command: 'node server.mjs', env: { PORT:'5180' }, url: 'http://localhost:5180', reuseExistingServer: false },
});
