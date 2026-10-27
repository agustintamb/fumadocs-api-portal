import { expect, test } from '@playwright/test'
import type { APIRequestContext, Locator, Page } from '@playwright/test'

// Drives the playground against a running Portal API; it is not part of the smoke suite.
test.skip(
  !process.env.PORTAL_API,
  'Set PORTAL_API=1 to test the playground against the API',
)

// The playground preselects the environment's server: "Local" in a local build and
// "Producción" on GitHub Pages (BASE_URL).
const API_URL = process.env.BASE_URL
  ? 'https://devportal-api.onrender.com'
  : 'http://localhost:5080'
const DEMO_USER = { username: 'demo', password: 'demo1234' }
const API_ID = 'petstore'

// Paths are relative so they resolve under the GitHub Pages subpath too.
const openPlayground = async (page: Page, path: string, headingId: string) => {
  await page.goto(path)
  await page
    .locator(`div:has(> div > [id="${headingId}"])`)
    .getByRole('button', { name: 'Probar en el playground' })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: API_URL })).toBeVisible()
  return dialog
}

const authorize = (dialog: Locator, token: string) =>
  dialog.getByRole('textbox', { name: 'Authorization' }).fill(`Bearer ${token}`)

const send = async (dialog: Locator, status: number) => {
  await dialog.getByRole('button', { name: /^Enviar/ }).click()
  // "200 OK"; the lookahead skips the timing line next to it ("200 ms · 287 B").
  // Longer than the playground's own 10 s request timeout, so a slow Render answer still counts.
  await expect(dialog.getByText(new RegExp(`^${status} (?!ms)`))).toBeVisible({
    timeout: 15_000,
  })
}

const responseBody = async (dialog: Locator) =>
  JSON.parse(
    (await dialog
      .getByRole('tabpanel', { name: 'Cuerpo' })
      .locator('code')
      .textContent()) ?? '',
  )

// A failed run may leave the subscription behind, and creating it again would answer 409.
const removeLeftoverSubscription = async (request: APIRequestContext) => {
  const tokenResponse = await request.post(`${API_URL}/auth/token`, { data: DEMO_USER })
  expect(tokenResponse.ok()).toBe(true)
  const headers = { Authorization: `Bearer ${(await tokenResponse.json()).accessToken}` }
  const listResponse = await request.get(`${API_URL}/subscriptions`, { headers })
  expect(listResponse.ok()).toBe(true)
  const subscriptions = await listResponse.json()
  for (const { id, apiId } of subscriptions)
    if (apiId === API_ID)
      await request.delete(`${API_URL}/subscriptions/${id}`, { headers })
}

// Don't leave the shared demo user subscribed if a step fails halfway.
test.afterEach(async ({ request }) => removeLeftoverSubscription(request))

test('playground flow against the portal api', async ({ page, request }) => {
  test.setTimeout(180_000)

  await test.step('wake the api up', async () => {
    // Render's free tier can take about a minute to start after being idle.
    const health = await request.get(`${API_URL}/health`, { timeout: 90_000 })
    expect(health.ok()).toBe(true)
    await removeLeftoverSubscription(request)
  })

  const token = await test.step('get a token with the demo user', async () => {
    const dialog = await openPlayground(
      page,
      'api-store/portal/v1/autenticacion',
      'obtener-un-token-de-acceso-con-el-usuario-demo',
    )
    await dialog.getByRole('textbox', { name: 'username' }).fill(DEMO_USER.username)
    await dialog.getByRole('textbox', { name: 'password' }).fill(DEMO_USER.password)
    await send(dialog, 200)
    const { accessToken } = await responseBody(dialog)
    expect(accessToken).toEqual(expect.any(String))
    return accessToken as string
  })

  await test.step('read the dashboard stats', async () => {
    const dialog = await openPlayground(
      page,
      'api-store/portal/v1/dashboard',
      'obtener-las-métricas-del-dashboard',
    )
    await authorize(dialog, token)
    await send(dialog, 200)
    await expect(dialog.getByRole('tabpanel', { name: 'Cuerpo' })).toContainText(
      'Solicitudes totales',
    )
  })

  const subscriptionId = await test.step('subscribe to an api', async () => {
    const dialog = await openPlayground(
      page,
      'api-store/portal/v1/suscripciones',
      'suscribirse-a-una-api-del-catálogo',
    )
    await authorize(dialog, token)
    await dialog.getByRole('textbox', { name: 'apiId' }).fill(API_ID)
    await send(dialog, 201)
    const { id, apiId } = await responseBody(dialog)
    expect(apiId).toBe(API_ID)
    return id as string
  })

  await test.step('cancel the subscription', async () => {
    const dialog = await openPlayground(
      page,
      'api-store/portal/v1/suscripciones',
      'cancelar-una-suscripción',
    )
    await authorize(dialog, token)
    // The id is editable both in the url bar and in the "Ruta" section.
    await dialog.getByRole('textbox', { name: 'id' }).last().fill(subscriptionId)
    await send(dialog, 204)
  })
})
