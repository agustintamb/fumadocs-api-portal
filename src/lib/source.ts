import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { defineDocs } from 'fumadocs-mdx/macro'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'
import type { OpenAPIServer } from 'fumadocs-openapi/server'
import { petstoreV2, petstoreV3, pokeapi, portalApiV1, portalApiV2 } from '@/lib/openapi'
import { endpointsPlugin } from '@/lib/endpoints-plugin'
import { normalizeText } from '@/utils/normalize-text'

const docs = defineDocs({
  dir: 'content',
  docs: {
    // `sidebarTitle` lets a page use a shorter sidebar label than its `title` (the H1).
    schema: pageSchema.extend({ sidebarTitle: z.string().optional() }),
  },
  meta: {
    schema: metaSchema,
  },
})

// One page per tag (like Zudoku), generated in memory from the specs. Slugs drop accents so
// Spanish tags get ASCII URLs ("Autenticación" -> /autenticacion).
function apiSource(server: OpenAPIServer, baseDir: string) {
  return server.staticSource({
    baseDir,
    per: 'tag',
    slugify: (name) => normalizeText(name).replace(/\s+/g, '-'),
    meta: { folderStyle: 'separator' },
  })
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader(
  {
    content: docs.toFumadocsSource(),
    portalV1: await apiSource(portalApiV1, 'api-store/portal/v1/(generated)'),
    portalV2: await apiSource(portalApiV2, 'api-store/portal/v2/(generated)'),
    petstoreV2: await apiSource(petstoreV2, 'api-store/petstore/v2/(generated)'),
    petstoreV3: await apiSource(petstoreV3, 'api-store/petstore/v3/(generated)'),
    pokeapi: await apiSource(pokeapi, 'api-store/pokeapi/(generated)'),
  },
  {
    baseUrl: '/',
    plugins: [
      portalApiV1.loaderPlugin(),
      endpointsPlugin(),
      lucideIconsPlugin(),
      {
        name: 'sidebar-title',
        transformPageTree: {
          file(node, filePath) {
            const file = filePath ? this.storage.read(filePath) : undefined
            const sidebarTitle =
              file?.format === 'page' && 'sidebarTitle' in file.data
                ? file.data.sidebarTitle
                : undefined
            if (typeof sidebarTitle !== 'string' || !sidebarTitle) return node
            return { ...node, name: sidebarTitle }
          },
        },
      },
    ],
  },
)
