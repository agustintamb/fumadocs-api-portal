import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { defineDocs } from 'fumadocs-mdx/macro'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

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

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [
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
})
