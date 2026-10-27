import { createOpenAPI } from 'fumadocs-openapi/server'

const PROXY_URL = '/api/proxy'

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
