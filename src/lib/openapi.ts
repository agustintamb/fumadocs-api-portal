import { readFile } from 'node:fs/promises'
import { createOpenAPI } from 'fumadocs-openapi/server'
import { selectServers } from '@/utils/select-servers'

const IS_STATIC_EXPORT = process.env.STATIC_EXPORT === '1'

// Each deployed environment shows the Portal API url it talks to. Locally it defaults to the API
// running on this machine and keeps the spec's other servers (Producción) as alternatives.
const PORTAL_API_URL =
  process.env.PORTAL_API_URL ?? (IS_STATIC_EXPORT ? undefined : 'http://localhost:5080')
if (!PORTAL_API_URL) throw new Error('PORTAL_API_URL is required for the static export')

// No proxy for any API: they all allow CORS, and the proxy rejects private hosts such as
// localhost. Add `proxyUrl: '/api/proxy'` only for an API without CORS (server mode only).
const createPortalApi = (spec: string) =>
  createOpenAPI({
    input: {
      [spec]: async () =>
        selectServers(JSON.parse(await readFile(spec, 'utf8')), PORTAL_API_URL, {
          keepOthers: !IS_STATIC_EXPORT,
        }),
    },
  })

export const portalApiV1 = createPortalApi('./apis/portal-api.json')
export const portalApiV2 = createPortalApi('./apis/portal-api-v2.json')
export const petstoreV2 = createOpenAPI({ input: ['./apis/petstore-v2.json'] })
export const petstoreV3 = createOpenAPI({ input: ['./apis/petstore-v3.json'] })
export const pokeapi = createOpenAPI({ input: ['./apis/pokeapi.yaml'] })
