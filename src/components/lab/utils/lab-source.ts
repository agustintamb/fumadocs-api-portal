import 'server-only'
import { flattenTree } from 'fumadocs-core/page-tree'
import type * as PageTree from 'fumadocs-core/page-tree'
import { source } from '@/lib/source'

const SOURCE_PREFIX = '/api-store/portal'
const LAB_PREFIX = '/lab/portal'

function isPortalUrl(url: string): boolean {
  return url.startsWith(`${SOURCE_PREFIX}/`)
}

export function toLabUrl(url: string): string {
  return isPortalUrl(url) ? LAB_PREFIX + url.slice(SOURCE_PREFIX.length) : url
}

// `/lab/portal/v1/x` (slug `['portal', 'v1', 'x']`) is the page `/api-store/portal/v1/x`.
export function getPortalPage(slug: string[]) {
  return slug[0] === 'portal' ? source.getPage(['api-store', ...slug]) : undefined
}

export function getLabParams(): { slug: string[] }[] {
  return source
    .getPages()
    .filter((page) => isPortalUrl(page.url))
    .map((page) => ({ slug: page.url.slice(1).split('/').slice(1) }))
}

function rewriteNode<T extends PageTree.Node>(node: T): T {
  if (node.type === 'page') return { ...node, url: toLabUrl(node.url) }
  if (node.type === 'folder')
    return {
      ...node,
      index: node.index && rewriteNode(node.index),
      children: node.children.map(rewriteNode),
    }
  return node
}

// The topmost folder whose pages are all Portal API pages.
function findPortalFolder(nodes: PageTree.Node[]): PageTree.Folder | undefined {
  for (const node of nodes) {
    if (node.type !== 'folder') continue
    const urls = flattenTree([node]).map((item) => item.url)
    if (urls.length > 0 && urls.every(isPortalUrl)) return node
    const found = findPortalFolder(node.children)
    if (found) return found
  }
}

/** The page tree of the Portal API only, linking to the lab. */
export function getLabTree(): PageTree.Root {
  const portal = findPortalFolder(source.getPageTree().children)
  return {
    $id: 'lab',
    name: 'Lab',
    children: portal ? [rewriteNode(portal)] : [],
  }
}
