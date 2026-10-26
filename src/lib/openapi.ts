import { createOpenAPI, type OpenAPIServer } from 'fumadocs-openapi/server'

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

async function getSpecVersion(server: OpenAPIServer): Promise<string> {
  const [schema] = Object.values(await server.getSchemas())
  return schema.bundled.info?.version ?? ''
}

/** `info.version` of each spec, keyed by the URL of its folder in `content/api-store`. */
export async function getApiVersions(): Promise<Record<string, string>> {
  const folders = {
    '/api-store/petstore': petstore,
    '/api-store/blog/v1': blogV1,
    '/api-store/blog/v2': blogV2,
    '/api-store/auth': auth,
  }
  const entries = await Promise.all(
    Object.entries(folders).map(async ([url, server]) => [
      url,
      await getSpecVersion(server),
    ]),
  )
  return Object.fromEntries(entries)
}
