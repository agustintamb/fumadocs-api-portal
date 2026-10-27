import { flattenTree } from 'fumadocs-core/page-tree'
import type * as PageTree from 'fumadocs-core/page-tree'

// Folders such as `/docs` or `/api-store/portal` have no page of their own: their first page,
// in sidebar order, stands in for them.
export function getFirstPageUrl(
  tree: PageTree.Root,
  folderUrl: string,
): string | undefined {
  const prefix = `${folderUrl}/`
  return flattenTree(tree.children).find((item) => item.url.startsWith(prefix))?.url
}
