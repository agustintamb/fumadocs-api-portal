import type * as PageTree from 'fumadocs-core/page-tree'
import { getLayoutTabs } from 'fumadocs-ui/layouts/shared'
import type { LayoutTab } from 'fumadocs-ui/layouts/shared'

/**
 * One layout tab per API version folder, titled with its spec version.
 *
 * `getVersion` returns the spec version of the page at a URL, or `undefined` if it isn't an API page.
 */
export function getVersionTabs(
  tree: PageTree.Root,
  getVersion: (url: string) => string | undefined,
): LayoutTab[] {
  return getLayoutTabs(tree, {
    transform(tab) {
      const version = getVersion(tab.url)
      return version ? { ...tab, title: version } : null
    },
  })
}
