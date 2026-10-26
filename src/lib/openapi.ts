import { createOpenAPI } from 'fumadocs-openapi/server'

const proxyUrl = '/api/proxy'

export const petstore = createOpenAPI({ proxyUrl, input: ['./apis/openapi.yaml'] })
export const blogV1 = createOpenAPI({ proxyUrl, input: ['./apis/blog-api.yaml'] })
export const blogV2 = createOpenAPI({ proxyUrl, input: ['./apis/blog-api-v2.yaml'] })
export const auth = createOpenAPI({ proxyUrl, input: ['./apis/auth-api.yaml'] })
