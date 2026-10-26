import { flattenTree } from 'fumadocs-core/page-tree'
import type * as PageTree from 'fumadocs-core/page-tree'

/**
 * Returns the URL of the first page inside the folder whose URL is `folderUrl`,
 * searching depth-first in tree order, or `undefined` when no folder matches.
 *
 * Page tree folders have no URL of their own, so a folder's URL is:
 * - its `index` page URL, when it has one;
 * - otherwise the longest segment prefix shared by the parent paths of all its pages
 *   (e.g. `/api-store/blog/v1/posts` and `/api-store/blog/v2/posts` → `/api-store/blog`).
 */
export function findFirstPageUrl(
  tree: PageTree.Root,
  folderUrl: string,
): string | undefined {
  for (const node of tree.children) {
    const found = searchNode(node, folderUrl)
    if (found) return found
  }
  return undefined
}

function searchNode(node: PageTree.Node, folderUrl: string): string | undefined {
  if (node.type !== 'folder') return undefined
  if (getFolderUrl(node) === folderUrl) return flattenTree([node])[0]?.url

  for (const child of node.children) {
    const found = searchNode(child, folderUrl)
    if (found) return found
  }
  return undefined
}

function getFolderUrl(folder: PageTree.Folder): string | undefined {
  if (folder.index) return folder.index.url

  const parentPaths = flattenTree([folder]).map((item) =>
    toSegments(item.url).slice(0, -1),
  )
  const [first, ...rest] = parentPaths
  if (!first) return undefined

  let length = first.length
  for (const segments of rest) {
    let shared = 0
    while (shared < length && segments[shared] === first[shared]) shared++
    length = shared
  }
  return '/' + first.slice(0, length).join('/')
}

function toSegments(url: string): string[] {
  return url.split('/').filter(Boolean)
}
