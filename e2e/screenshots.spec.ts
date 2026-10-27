import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// Refreshes docs/screenshots on demand; it is not part of the smoke suite.
test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to refresh docs/screenshots')
test.describe.configure({ mode: 'serial' })
test.use({ viewport: { width: 1440, height: 900 } })

const DIR = 'docs/screenshots'

const PAGES = [
  { name: 'home', path: '/home', fullPage: true },
  { name: 'dashboard', path: '/dashboard', fullPage: true },
  { name: 'api-store', path: '/api-store', fullPage: true },
  { name: 'introduction', path: '/docs/introduction', fullPage: false },
  { name: 'petstore', path: '/api-store/petstore/v3/pet', fullPage: false },
  { name: 'portal-v2', path: '/api-store/portal/v2/catalogo', fullPage: false },
]

const openPlayground = async (page: Page, operationId: string) => {
  await page
    .locator(`div:has(> div > #${operationId})`)
    .getByRole('button', { name: 'Probar en el playground' })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: /^Enviar/ })).toBeVisible()
  return dialog
}

for (const colorScheme of ['light', 'dark'] as const)
  test.describe(colorScheme, () => {
    test.use({ colorScheme })

    for (const { name, path, fullPage } of PAGES)
      test(name, async ({ page }) => {
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        await page.screenshot({
          path: `${DIR}/${name}-${colorScheme}.png`,
          fullPage,
          animations: 'disabled',
        })
      })
  })

test.describe('library gaps', () => {
  test.use({ colorScheme: 'light' })

  test('playground auth header', async ({ page }) => {
    await page.goto('/api-store/petstore/v3/pet')
    const dialog = await openPlayground(page, 'finds-pets-by-status')
    await dialog.screenshot({ path: `${DIR}/gap-playground-auth.png` })
  })

  test('oauth fields', async ({ page }) => {
    await page.goto('/api-store/petstore/v3/pet')
    const dialog = await openPlayground(page, 'finds-pets-by-status')
    await dialog.getByRole('button', { name: /^Autorizar/ }).click()
    await expect(dialog.getByText('Alcances', { exact: true })).toBeVisible()
    await dialog.screenshot({ path: `${DIR}/gap-oauth-fields.png` })
  })

  test('upload image body', async ({ page }) => {
    await page.goto('/api-store/petstore/v3/pet')
    const dialog = await openPlayground(page, 'uploads-an-image')
    await dialog.screenshot({ path: `${DIR}/gap-upload-image.png` })
  })
})
