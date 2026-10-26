import { flattenTree, getPageTreeRoots } from 'fumadocs-core/page-tree'
import type * as PageTree from 'fumadocs-core/page-tree'

/**
 * Previous and next pages of the page footer, within the page's root folder like Fumadocs' own,
 * but skipping the sidebar links to endpoint anchors.
 */
export function findPageNeighbours(
  tree: PageTree.Root,
  url: string,
): { previous?: PageTree.Item; next?: PageTree.Item } {
  for (const root of getPageTreeRoots(tree)) {
    const pages = flattenTree(root.children).filter((item) => !item.url.includes('#'))
    const index = pages.findIndex((item) => item.url === url)
    if (index !== -1) return { previous: pages[index - 1], next: pages[index + 1] }
  }
  return {}
}
