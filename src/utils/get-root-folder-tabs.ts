import { flattenTree } from 'fumadocs-core/page-tree'
import type * as PageTree from 'fumadocs-core/page-tree'
import type { LayoutTab } from 'fumadocs-ui/layouts/shared'

/**
 * Layout tabs for every root folder in tree order, like Fumadocs' `getLayoutTabs()`.
 *
 * Fumadocs skips a root folder without an index or direct pages (e.g. Blog API, which only
 * holds the v1/v2 version folders); here it links to its first nested page instead.
 */
export function getRootFolderTabs(tree: PageTree.Root): LayoutTab[] {
  const tabs: LayoutTab[] = []

  function visit(nodes: PageTree.Node[]) {
    for (const node of nodes) {
      if (node.type !== 'folder') continue
      const url = node.root ? flattenTree([node])[0]?.url : undefined
      if (url) {
        tabs.push({
          title: node.name,
          description: node.description,
          icon: node.icon,
          url,
          $folder: node,
        })
      }
      visit(node.children)
    }
  }

  visit(tree.children)
  return tabs
}
