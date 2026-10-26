import type * as PageTree from 'fumadocs-core/page-tree'
import type { LayoutTab } from 'fumadocs-ui/layouts/shared'

// Fumadocs' `getLayoutTabs` only links a root folder to a direct child page, but the endpoints
// plugin turns API pages into folders indexed by the page.
function firstPageUrl(folder: PageTree.Folder): string | undefined {
  for (const child of folder.children) {
    if (child.type === 'page') return child.url
    if (child.type === 'folder' && !child.root && child.index) return child.index.url
  }
}

/**
 * One layout tab per API version folder, titled with its spec version.
 *
 * `getVersion` returns the spec version of the page at a URL, or `undefined` if it isn't an API page.
 */
export function getVersionTabs(
  tree: PageTree.Root,
  getVersion: (url: string) => string | undefined,
): LayoutTab[] {
  const tabs: LayoutTab[] = []
  function visit(node: PageTree.Root | PageTree.Folder) {
    if (node.type === 'folder' && node.root) {
      const url = firstPageUrl(node)
      const version = url && getVersion(url)
      if (url && version) tabs.push({ title: version, url, $folder: node })
    }
    for (const child of node.children) if (child.type === 'folder') visit(child)
  }
  visit(tree)
  return tabs
}
