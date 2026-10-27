import { readFile } from 'node:fs/promises'
import { createOpenAPI } from 'fumadocs-openapi/server'
import { selectServers } from '@/utils/select-servers'

// The static export (GitHub Pages) has no server, so the proxy route doesn't exist there.
const IS_STATIC_EXPORT = process.env.STATIC_EXPORT === '1'
const PROXY_URL = IS_STATIC_EXPORT ? undefined : '/api/proxy'
const PORTAL_SPEC = './apis/portal-api.json'

// Each deployed environment shows the Portal API url it talks to. Locally it defaults to the API
// running on this machine and keeps the spec's other servers (Producción) as alternatives.
const PORTAL_API_URL =
  process.env.PORTAL_API_URL ?? (IS_STATIC_EXPORT ? undefined : 'http://localhost:5080')
if (!PORTAL_API_URL) throw new Error('PORTAL_API_URL is required for the static export')

export const petstore = createOpenAPI({
  proxyUrl: PROXY_URL,
  input: ['./apis/openapi.yaml'],
})
export const blogV1 = createOpenAPI({
  proxyUrl: PROXY_URL,
  input: ['./apis/blog-api.yaml'],
})
export const blogV2 = createOpenAPI({
  proxyUrl: PROXY_URL,
  input: ['./apis/blog-api-v2.yaml'],
})
export const auth = createOpenAPI({
  proxyUrl: PROXY_URL,
  input: ['./apis/auth-api.yaml'],
})
// No proxy: the proxy rejects private hosts such as localhost, and this API already allows CORS.
export const portalApi = createOpenAPI({
  input: {
    [PORTAL_SPEC]: async () =>
      selectServers(JSON.parse(await readFile(PORTAL_SPEC, 'utf8')), PORTAL_API_URL, {
        keepOthers: !IS_STATIC_EXPORT,
      }),
  },
})
