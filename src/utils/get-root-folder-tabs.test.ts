import type * as PageTree from 'fumadocs-core/page-tree'
import { describe, expect, it } from 'vitest'
import { getRootFolderTabs } from '@/utils/get-root-folder-tabs'

function page(url: string): PageTree.Item {
  return { type: 'page', name: url, url }
}

function folder(
  name: string,
  root: PageTree.Folder['root'],
  children: PageTree.Node[],
): PageTree.Folder {
  return { type: 'folder', name, root, children }
}

const docs = folder('Documentación', true, [page('/introduction')])
const v1 = folder('v1', 'version', [page('/api-store/blog/v1/posts')])
const v2 = folder('v2', 'version', [page('/api-store/blog/v2/posts')])
const blog = folder('Blog API', true, [v1, v2])

const tree: PageTree.Root = {
  name: 'Portal de APIs',
  children: [docs, folder('api-store', undefined, [blog])],
}

describe('getRootFolderTabs', () => {
  it('returns one tab per root folder in tree order, nested roots included', () => {
    expect(getRootFolderTabs(tree).map((tab) => tab.title)).toEqual([
      'Documentación',
      'Blog API',
      'v1',
      'v2',
    ])
  })

  it('links a folder without pages of its own to its first nested page', () => {
    const blogTab = getRootFolderTabs(tree).find((tab) => tab.$folder === blog)
    expect(blogTab?.url).toBe('/api-store/blog/v1/posts')
  })

  it('prefers the folder index page', () => {
    const guides: PageTree.Folder = {
      ...folder('Guías', true, [page('/guides/setup')]),
      index: page('/guides'),
    }
    expect(getRootFolderTabs({ name: 'root', children: [guides] })[0]?.url).toBe(
      '/guides',
    )
  })

  it('skips root folders without pages', () => {
    const empty = folder('Vacía', true, [])
    expect(getRootFolderTabs({ name: 'root', children: [empty] })).toEqual([])
  })
})
