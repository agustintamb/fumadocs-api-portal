import type * as PageTree from 'fumadocs-core/page-tree'
import { getLayoutTabs } from 'fumadocs-ui/layouts/shared'
import type { LayoutTab } from 'fumadocs-ui/layouts/shared'

/**
 * One layout tab per API version folder, titled with its spec version.
 *
 * `versions` maps a version folder URL (e.g. `/api-store/blog/v1`) to its `info.version`.
 */
export function getVersionTabs(
  tree: PageTree.Root,
  versions: Record<string, string>,
): LayoutTab[] {
  return getLayoutTabs(tree, {
    transform(tab) {
      const folderUrl = Object.keys(versions).find((url) => tab.url.startsWith(`${url}/`))
      return folderUrl ? { ...tab, title: versions[folderUrl] } : null
    },
  })
}
