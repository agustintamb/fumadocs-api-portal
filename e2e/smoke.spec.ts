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

test.describe('desktop header', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('renders the same header on every section', async ({ page }) => {
    const boxes = []
    for (const path of ['/home', '/docs/introduction', '/api-store/petstore/pet']) {
      await page.goto(path)
      const header = page.locator('header').first()
      await expect(
        header.getByRole('link', { name: 'Fumadocs', exact: true }),
      ).toHaveAttribute('href', '/home')
      await expect(header.getByRole('listitem').getByRole('link')).toHaveText([
        'Inicio',
        'Dashboard',
        'Documentación',
        'API Store',
      ])
      await expect(header.getByRole('button', { name: /^Buscar/ })).toBeVisible()
      await expect(header.getByRole('button', { name: 'Cambiar tema' })).toBeVisible()
      await expect(page.locator('img[src*="logo-"]')).toHaveCount(0)
      boxes.push(await header.boundingBox())
    }
    expect(boxes[1]).toEqual(boxes[0])
    expect(boxes[2]).toEqual(boxes[0])
  })
})

test.describe('tablet header', () => {
  test.use({ viewport: { width: 900, height: 800 } })

  test('matches between Home and Docs', async ({ page }) => {
    const buttons = ['Abrir búsqueda', 'Cambiar tema']
    const boxes = []
    for (const path of ['/home', '/docs/introduction']) {
      await page.goto(path)
      const header = page.locator('header').first()
      await expect(header.getByRole('listitem').getByRole('link')).toHaveCount(4)
      await expect(header.getByRole('button', { name: 'Abrir menú' })).toBeHidden()
      await expect(
        header.getByRole('button', { name: 'Abrir barra lateral' }),
      ).toBeHidden()
      boxes.push(
        await Promise.all(
          buttons.map((name) =>
            header.getByRole('button', { name: new RegExp(`^${name}`) }).boundingBox(),
          ),
        ),
      )
    }
    expect(boxes[1]).toEqual(boxes[0])
  })
})

test('404 page has the site header', async ({ page }) => {
  const res = await page.goto('/no-existe')
  expect(res?.status()).toBe(404)
  await expect(
    page.locator('header').first().getByRole('link', { name: 'Fumadocs', exact: true }),
  ).toHaveAttribute('href', '/home')
})

test.describe('mobile header', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('opens the sidebar from the header on API pages', async ({ page }) => {
    await page.goto('/api-store/petstore/pet')
    // The header must not squeeze the page content on small screens.
    expect((await page.locator('article').boundingBox())?.width).toBeGreaterThan(300)
    await page
      .locator('header')
      .first()
      .getByRole('button', { name: 'Abrir barra lateral' })
      .click()
    const panel = page.getByRole('complementary').filter({ visible: true })
    await expect(
      panel.getByRole('link', { name: 'API Store', exact: true }),
    ).toBeVisible()
    await expect(panel.getByRole('link', { name: 'Pet', exact: true })).toBeVisible()
    await expect(
      panel.getByRole('button', { name: 'Versión 1.0.19', exact: true }),
    ).toBeVisible()
  })
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

const versionSelect = (page: Page) =>
  page.locator('#nd-sidebar').getByRole('button', { name: /^Versión / })

test('has no section switcher', async ({ page }) => {
  for (const path of ['/docs/introduction', '/api-store/petstore/pet']) {
    await page.goto(path)
    const sidebar = page.locator('#nd-sidebar')
    for (const section of ['Documentación', 'Petstore API', 'Blog API', 'Auth API'])
      await expect(sidebar.getByRole('button', { name: section })).toHaveCount(0)
  }
})

test('shows a disabled version selector for single-version APIs', async ({ page }) => {
  for (const [path, version] of [
    ['/api-store/petstore/pet', '1.0.19'],
    ['/api-store/auth/auth', '2.0.0'],
  ]) {
    await page.goto(path)
    await expect(versionSelect(page)).toHaveText(version)
    await expect(versionSelect(page)).toHaveAccessibleName(`Versión ${version}`)
    await expect(versionSelect(page)).toBeDisabled()
  }
  await page.goto('/docs/introduction')
  await expect(page.getByRole('button', { name: 'Versión' })).toHaveCount(0)
})

test('switches Blog versions to the matching page', async ({ page }) => {
  await page.goto('/api-store/blog/v2/comments')
  await expect(versionSelect(page)).toHaveText('2.0.0')
  await expect(versionSelect(page)).toHaveAccessibleName('Versión 2.0.0')
  await expect(versionSelect(page)).toBeEnabled()
  await versionSelect(page).click()
  await expect(page.getByRole('link', { name: '2.0.0', exact: true })).toBeVisible()
  await page.getByRole('link', { name: '1.0.0', exact: true }).click()
  await expect(page).toHaveURL(/\/api-store\/blog\/v1\/comments$/)
})

test('lists endpoints with their verb in the sidebar', async ({ page }) => {
  await page.goto('/api-store/petstore/pet')
  const endpoint = page
    .locator('#nd-sidebar')
    .getByRole('link', { name: 'Update an existing pet PUT', exact: true })
  await expect(endpoint).toBeVisible()
  await endpoint.click()
  await expect(page).toHaveURL(/\/api-store\/petstore\/pet#update-an-existing-pet$/)
  await expect(page.locator('h2#update-an-existing-pet')).toBeInViewport()

  await page.goto('/api-store/petstore/store#place-an-order-for-a-pet')
  await expect(page.locator('h2#place-an-order-for-a-pet')).toBeInViewport()
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
