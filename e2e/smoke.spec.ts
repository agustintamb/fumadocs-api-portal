import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const openPlayground = async (page: Page, operationId: string) => {
  await page
    .locator(`div:has(> div > #${operationId})`)
    .getByRole('button', { name: 'Probar en el playground' })
    .click()
  return page.getByRole('dialog')
}

test('root redirects to /home', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/home$/)
})

for (const [path, text] of [
  ['/home', 'Integraciones más rápidas con nuestras APIs'],
  ['/dashboard', 'Actividad reciente'],
  ['/api-store', 'APIs disponibles'],
  ['/docs/introduction', 'Bienvenido al Portal de APIs · Fumadocs'],
])
  test(`${path} renders spanish copy`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByText(text).first()).toBeVisible()
  })

for (const path of ['/introduction', '/docs'])
  test(`${path} redirects to the docs introduction`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL(/\/docs\/introduction$/)
  })

test('marks Docs as current on docs pages', async ({ page }) => {
  await page.goto('/docs/introduction')
  await expect(
    page
      .getByRole('link', { name: 'Documentación', exact: true })
      .filter({ visible: true }),
  ).toHaveAttribute('aria-current', 'page')
})

for (const [root, landing] of [
  ['/api-store/petstore', /\/api-store\/petstore\/pet$/],
  ['/api-store/blog', /\/api-store\/blog\/v1\/posts$/],
  ['/api-store/blog/v1', /\/api-store\/blog\/v1\/posts$/],
  ['/api-store/blog/v2', /\/api-store\/blog\/v2\/posts$/],
  ['/api-store/auth', /\/api-store\/auth\/auth$/],
] as const)
  test(`${root} lands on a reference page`, async ({ page }) => {
    const res = await page.goto(root)
    expect(res?.status()).toBeLessThan(400)
    await expect(page).toHaveURL(landing)
    // The playground opens in a dialog, so the send button only exists after opening it.
    await page.getByRole('button', { name: 'Probar en el playground' }).first().click()
    await expect(page.getByRole('button', { name: 'Enviar' }).first()).toBeVisible()
  })

test('blog lands on v1', async ({ page }) => {
  await page.goto('/api-store/blog')
  await expect(page).toHaveURL(/\/api-store\/blog\/v1\//)
})

for (const tag of ['posts', 'comments'])
  test(`blog version switch keeps the ${tag} page`, async ({ page }) => {
    await page.goto(`/api-store/blog/v1/${tag}`)
    await page.getByRole('button', { name: 'v1', exact: true }).click()
    await page.getByRole('link', { name: /^v2/ }).click()
    await expect(page).toHaveURL(new RegExp(`/api-store/blog/v2/${tag}$`))
  })

test('petstore playground and auth are in spanish', async ({ page }) => {
  await page.goto('/api-store/petstore/pet')
  await expect(page.getByText('Parámetros de consulta').first()).toBeVisible()

  const playground = await openPlayground(page, 'finds-pets-by-status')
  await expect(playground.getByRole('button', { name: /^Enviar/ })).toBeVisible()
  await expect(playground.getByText('Consulta', { exact: true })).toBeVisible()

  await playground.getByRole('button', { name: /^Autorizar/ }).click()
  await expect(playground.getByText('Implícito')).toBeVisible()
  await expect(playground.getByText('Alcances', { exact: true })).toBeVisible()
  await expect(
    playground.getByRole('button', { name: 'Autorizar', exact: true }),
  ).toBeVisible()
  // 'Authorization' is still shown outside this panel as the header name (see NOTES.md).
  for (const english of ['Authorization', 'Authorize', 'Send', 'Scopes', 'Implicit'])
    await expect(
      playground.getByText(english, { exact: true }).filter({ visible: true }),
    ).toHaveCount(0)
})

test('petstore api key selector is in spanish', async ({ page }) => {
  await page.goto('/api-store/petstore/pet')
  const playground = await openPlayground(page, 'find-pet-by-id')
  await playground.getByRole('combobox').filter({ hasText: 'api_key' }).click()
  await expect(page.getByRole('option', { name: 'petstore_auth' })).toBeVisible()
  await page.getByRole('option', { name: 'api_key' }).click()
  await expect(playground.getByText('Autorización', { exact: true })).toBeVisible()
  for (const english of ['Authorize', 'Send', 'Path'])
    await expect(
      playground.getByText(english, { exact: true }).filter({ visible: true }),
    ).toHaveCount(0)
})

test('carousel animates by default and stops with reduced motion', async ({
  browser,
}) => {
  const animationName = (page: Page) =>
    page.getByTestId('clients-track').evaluate((el) => getComputedStyle(el).animationName)

  const defaultContext = await browser.newContext({ reducedMotion: 'no-preference' })
  const defaultPage = await defaultContext.newPage()
  await defaultPage.goto('/home')
  expect(await animationName(defaultPage)).toBe('clients-marquee')
  await defaultContext.close()

  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/home')
  expect(await animationName(page)).toBe('none')
  await context.close()
})
