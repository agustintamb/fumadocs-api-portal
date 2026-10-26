import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { defineDocs } from 'fumadocs-mdx/macro'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'
import type { OpenAPIServer } from 'fumadocs-openapi/server'
import { auth, blogV1, blogV2, petstore } from '@/lib/openapi'
import { endpointsPlugin } from '@/lib/endpoints-plugin'

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

// One page per tag (like Zudoku), generated in memory from the YAML specs.
function apiSource(server: OpenAPIServer, baseDir: string) {
  return server.staticSource({ baseDir, per: 'tag', meta: { folderStyle: 'separator' } })
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader(
  {
    content: docs.toFumadocsSource(),
    petstore: await apiSource(petstore, 'api-store/petstore/(generated)'),
    blogV1: await apiSource(blogV1, 'api-store/blog/v1/(generated)'),
    blogV2: await apiSource(blogV2, 'api-store/blog/v2/(generated)'),
    auth: await apiSource(auth, 'api-store/auth/(generated)'),
  },
  {
    baseUrl: '/',
    plugins: [
      petstore.loaderPlugin(),
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
