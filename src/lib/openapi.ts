import { createOpenAPI } from 'fumadocs-openapi/server'

// The static export (GitHub Pages) has no server, so the proxy route doesn't exist there.
const PROXY_URL = process.env.STATIC_EXPORT === '1' ? undefined : '/api/proxy'

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
  input: ['./apis/portal-api.json'],
})
