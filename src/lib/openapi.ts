import { readFile } from 'node:fs/promises'
import { createOpenAPI } from 'fumadocs-openapi/server'
import { withoutLocalServers } from '@/utils/without-local-servers'

// The static export (GitHub Pages) has no server, so the proxy route doesn't exist there.
const IS_STATIC_EXPORT = process.env.STATIC_EXPORT === '1'
const PROXY_URL = IS_STATIC_EXPORT ? undefined : '/api/proxy'
const PORTAL_SPEC = './apis/portal-api.json'

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
// The published site drops the "Local" server: it would point to the visitor's own machine.
export const portalApi = createOpenAPI({
  input: IS_STATIC_EXPORT
    ? {
        [PORTAL_SPEC]: async () =>
          withoutLocalServers(JSON.parse(await readFile(PORTAL_SPEC, 'utf8'))),
      }
    : [PORTAL_SPEC],
})
