import type * as PageTree from 'fumadocs-core/page-tree'
import { expect, it } from 'vitest'
import { getFirstPageUrl } from '@/utils/get-first-page-url'

function page(url: string): PageTree.Item {
  return { type: 'page', name: url, url }
}

function folder(name: string, children: PageTree.Node[]): PageTree.Folder {
  return { type: 'folder', name, children }
}

const tree: PageTree.Root = {
  name: 'root',
  children: [
    folder('Docs', [page('/docs/introduction'), page('/docs/components')]),
    folder('Portal', [
      folder('v2', [page('/api-store/portal/v2/salud')]),
      folder('v1', [page('/api-store/portal/v1/salud')]),
    ]),
  ],
}

it.each([
  ['/docs', '/docs/introduction'],
  ['/api-store/portal', '/api-store/portal/v2/salud'],
  ['/api-store/portal/v1', '/api-store/portal/v1/salud'],
  ['/api-store/port', undefined],
  ['/home', undefined],
])('getFirstPageUrl(%s) is %s', (folderUrl, url) => {
  expect(getFirstPageUrl(tree, folderUrl)).toBe(url)
})
