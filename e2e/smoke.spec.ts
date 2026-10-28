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
    for (const path of ['/home', '/docs/introduction', '/api-store/petstore/v3/pet']) {
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
      // Docs has no page of its own: the link goes straight to its first page.
      await expect(
        header.getByRole('link', { name: 'Documentación', exact: true }),
      ).toHaveAttribute('href', /\/docs\/introduction\/?$/)
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
    await page.goto('/api-store/petstore/v3/pet')
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
      panel.getByRole('button', { name: 'Versión 1.0.28', exact: true }),
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

test('navigates the docs sidebar', async ({ page }) => {
  await page.goto('/docs/introduction')
  const sidebar = page.locator('#nd-sidebar')
  for (const section of ['Primeros pasos', 'Ejemplos MDX', 'Referencia', 'Links útiles'])
    await expect(sidebar.getByText(section, { exact: true })).toBeVisible()
  await expect(
    sidebar.getByRole('link', { name: 'Documentación de Fumadocs' }),
  ).toHaveAttribute('href', 'https://fumadocs.dev/docs')

  for (const [link, heading] of [
    ['Componentes', 'Componentes'],
    ['Catálogo de APIs (MDX)', 'Catálogo de APIs (MDX)'],
    ['Personalización', 'Personalización'],
    ['Estructura del proyecto', 'Estructura del proyecto'],
  ]) {
    await sidebar.getByRole('link', { name: link, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    await expect(
      page
        .locator('header')
        .first()
        .getByRole('link', { name: 'Documentación', exact: true }),
    ).toHaveAttribute('aria-current', 'page')
  }
})

for (const [root, landing] of [
  // APIs with versions open the newest one.
  ['/api-store/portal', /\/api-store\/portal\/v2\/salud$/],
  ['/api-store/petstore', /\/api-store\/petstore\/v3\/pet$/],
  ['/api-store/pokeapi', /\/api-store\/pokeapi\/pokemon$/],
] as const)
  test(`${root} lands on a reference page`, async ({ page }) => {
    const res = await page.goto(root)
    expect(res?.status()).toBeLessThan(400)
    await expect(page).toHaveURL(landing)
    // The playground opens in a dialog, so the send button only exists after opening it.
    await page.getByRole('button', { name: 'Probar en el playground' }).first().click()
    await expect(page.getByRole('button', { name: 'Enviar' }).first()).toBeVisible()
  })

const versionSelect = (page: Page) =>
  page.locator('#nd-sidebar').getByRole('button', { name: /^Versión / })

test('has no section switcher', async ({ page }) => {
  for (const path of ['/docs/introduction', '/api-store/petstore/v3/pet']) {
    await page.goto(path)
    const sidebar = page.locator('#nd-sidebar')
    for (const section of ['Documentación', 'Portal API', 'Petstore API', 'PokeAPI'])
      await expect(sidebar.getByRole('button', { name: section })).toHaveCount(0)
  }
})

test('shows a disabled version selector for single-version APIs', async ({ page }) => {
  await page.goto('/api-store/pokeapi/pokemon')
  await expect(versionSelect(page)).toHaveText('2.10.0')
  await expect(versionSelect(page)).toHaveAccessibleName('Versión 2.10.0')
  await expect(versionSelect(page)).toBeDisabled()
  await page.goto('/docs/introduction')
  await expect(page.getByRole('button', { name: 'Versión' })).toHaveCount(0)
})

test('switches Portal API versions to the matching page', async ({ page }) => {
  await page.goto('/api-store/portal/v2/autenticacion')
  await expect(versionSelect(page)).toHaveText('2.0.0')
  await expect(versionSelect(page)).toHaveAccessibleName('Versión 2.0.0')
  await expect(versionSelect(page)).toBeEnabled()
  await versionSelect(page).click()
  await expect(page.getByRole('link', { name: '2.0.0', exact: true })).toBeVisible()
  await page.getByRole('link', { name: '1.0.0', exact: true }).click()
  await expect(page).toHaveURL(/\/api-store\/portal\/v1\/autenticacion$/)
})

test('lists endpoints with their verb in the sidebar', async ({ page }) => {
  await page.goto('/api-store/petstore/v3/pet')
  const endpoint = page
    .locator('#nd-sidebar')
    .getByRole('link', { name: 'Update an existing pet. PUT', exact: true })
  await expect(endpoint).toBeVisible()
  await endpoint.click()
  await expect(page).toHaveURL(/\/api-store\/petstore\/v3\/pet#update-an-existing-pet$/)
  await expect(page.locator('h2#update-an-existing-pet')).toBeInViewport()

  await page.goto('/api-store/petstore/v3/store#place-an-order-for-a-pet')
  await expect(page.locator('h2#place-an-order-for-a-pet')).toBeInViewport()
})

test('publishes the portal api in the api store', async ({ page }) => {
  await page.goto('/api-store')
  await expect(page.getByRole('article')).toHaveCount(3)
  await expect(page.getByRole('article').filter({ hasText: 'Portal API' })).toContainText(
    'Interna',
  )
  await page.getByRole('button', { name: 'Públicas' }).click()
  await expect(page.getByRole('article')).toHaveCount(2)
  await page.getByRole('button', { name: 'Todas' }).click()
  await expect(
    page
      .getByRole('article')
      .filter({ hasText: 'Portal API' })
      .getByRole('link', { name: 'Ver documentación' }),
  ).toHaveAttribute('href', /\/api-store\/portal\/v2\/salud\/?$/)

  // Resources follow the spec's tag order, in both versions.
  const sidebar = page.locator('#nd-sidebar')
  const resources = ['Salud', 'Autenticación', 'Catálogo', 'Clientes', 'Dashboard']
  for (const version of ['v1', 'v2']) {
    await page.goto(`/api-store/portal/${version}/salud`)
    await expect(sidebar.getByRole('link', { name: 'Salud', exact: true })).toBeVisible()
    const links = await sidebar.getByRole('link').allInnerTexts()
    expect(links.filter((name) => resources.includes(name)).slice(0, 2)).toEqual([
      'Salud',
      'Autenticación',
    ])
  }

  await sidebar.getByRole('link', { name: 'Autenticación', exact: true }).click()
  await expect(page).toHaveURL(/\/api-store\/portal\/v2\/autenticacion$/)
  await expect(
    sidebar.getByRole('link', {
      name: 'Obtener un token de acceso con el usuario demo POST',
      exact: true,
    }),
  ).toBeVisible()
})

test('marks apis as internal or public', async ({ page }) => {
  await page.goto('/api-store')
  const card = (name: string) => page.getByRole('article').filter({ hasText: name })
  await expect(card('Portal API')).toContainText('Interna')
  for (const name of ['Petstore API', 'PokeAPI'])
    await expect(card(name)).toContainText('Pública')

  await page.goto('/api-store/portal/v2/salud')
  const titleRow = page.locator('div:has(> h1)').first()
  await expect(titleRow.getByText('Interna', { exact: true })).toBeVisible()
  await expect(titleRow.getByText('beta', { exact: true })).toHaveCount(0)

  await page.goto('/docs/introduction')
  for (const text of ['Interna', 'Pública'])
    await expect(page.getByText(text, { exact: true })).toHaveCount(0)
})

test('petstore playground and auth are in spanish', async ({ page }) => {
  await page.goto('/api-store/petstore/v3/pet')
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
  await page.goto('/api-store/petstore/v3/pet')
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
