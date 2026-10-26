import type { ReactNode } from 'react'
import type * as PageTree from 'fumadocs-core/page-tree'
import type { LoaderPlugin } from 'fumadocs-core/source'
import { MethodBadge } from '@/components/MethodBadge'

// The parts of a generated OpenAPI page's data that the sidebar needs.
interface OpenAPIPageData {
  toc: { depth: number; title: ReactNode; url: string }[]
  getOpenAPIPageProps: () => {
    operations?: { method: string }[]
    webhooks?: { method: string }[]
  }
}

function isOpenAPIPage(data: object): data is OpenAPIPageData {
  return 'getOpenAPIPageProps' in data && 'toc' in data
}

function toEndpointsFolder(page: PageTree.Item, data: OpenAPIPageData): PageTree.Node {
  const endpoints = data.toc.filter((item) => item.depth === 2)
  if (endpoints.length === 0) return page
  const { operations = [], webhooks = [] } = data.getOpenAPIPageProps()
  // The toc lists the operations with an operationId, then the webhooks, in order. Only when the
  // counts match do both lists line up one to one; otherwise a verb could land on the wrong endpoint.
  const methods = [...operations, ...webhooks].map((item) => item.method)
  const pairable = methods.length === endpoints.length

  return {
    type: 'folder',
    $id: `${page.$id}:endpoints`,
    name: page.name,
    icon: page.icon,
    index: page,
    children: endpoints.map((item, i) => {
      const method = pairable ? methods[i] : undefined
      return {
        type: 'page',
        $id: `${page.$id}${item.url}`,
        name: (
          <>
            {item.title} {method && <MethodBadge method={method} />}
          </>
        ),
        url: `${page.url}${item.url}`,
      }
    }),
  }
}

/** Lists the endpoints of each generated OpenAPI page as links to their anchors in the sidebar. */
export function endpointsPlugin(): LoaderPlugin {
  return {
    name: 'endpoints',
    transformPageTree: {
      // `file()` must return a page, so the parent folder swaps each OpenAPI page for a folder.
      folder(node) {
        const children = node.children.map((child) => {
          if (child.type !== 'page' || !child.$ref) return child
          const file = this.storage.read(child.$ref)
          if (file?.format !== 'page' || !isOpenAPIPage(file.data)) return child
          return toEndpointsFolder(child, file.data)
        })
        return { ...node, children }
      },
    },
  }
}
