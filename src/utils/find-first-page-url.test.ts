import type * as PageTree from 'fumadocs-core/page-tree'
import { describe, expect, it } from 'vitest'
import { findFirstPageUrl } from '@/utils/find-first-page-url'

function page(url: string): PageTree.Item {
  return { type: 'page', name: url, url }
}

function folder(name: string, children: PageTree.Node[]): PageTree.Folder {
  return { type: 'folder', name, children }
}

const tree: PageTree.Root = {
  name: 'Portal de APIs',
  children: [
    folder('Documentación', [page('/introduction')]),
    folder('api-store', [
      folder('petstore', [
        page('/api-store/petstore/pet'),
        page('/api-store/petstore/store'),
      ]),
      folder('blog', [
        folder('v1', [
          page('/api-store/blog/v1/posts'),
          page('/api-store/blog/v1/users'),
        ]),
        folder('v2', [page('/api-store/blog/v2/posts')]),
      ]),
    ]),
  ],
}

describe('findFirstPageUrl', () => {
  it('returns the first page inside the folder', () => {
    expect(findFirstPageUrl(tree, '/api-store/petstore')).toBe('/api-store/petstore/pet')
  })

  it('descends into nested folders (blog → v1)', () => {
    expect(findFirstPageUrl(tree, '/api-store/blog')).toBe('/api-store/blog/v1/posts')
  })

  it('finds a folder with a single page', () => {
    expect(findFirstPageUrl(tree, '/api-store/blog/v2')).toBe('/api-store/blog/v2/posts')
  })

  it('prefers the folder index page', () => {
    const withIndex: PageTree.Root = {
      name: 'root',
      children: [
        { ...folder('guides', [page('/guides/setup')]), index: page('/guides') },
      ],
    }
    expect(findFirstPageUrl(withIndex, '/guides')).toBe('/guides')
  })

  it('returns undefined for unknown folders', () => {
    expect(findFirstPageUrl(tree, '/api-store/nope')).toBeUndefined()
  })
})
