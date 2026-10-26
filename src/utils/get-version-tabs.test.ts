import type * as PageTree from 'fumadocs-core/page-tree'
import { describe, expect, it } from 'vitest'
import { getVersionTabs } from '@/utils/get-version-tabs'

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

// The endpoints plugin turns each API page into a folder indexed by that page.
function endpoints(index: PageTree.Item): PageTree.Folder {
  return { type: 'folder', name: index.name, index, children: [page(`${index.url}#op`)] }
}

const docs = folder('Documentación', true, [page('/docs/introduction')])
const petstore = folder('Petstore API', 'petstore', [
  endpoints(page('/api-store/petstore/pet')),
])
const v1 = folder('v1', 'blog', [endpoints(page('/api-store/blog/v1/posts'))])
const v2 = folder('v2', 'blog', [page('/api-store/blog/v2/posts')])
const blog = folder('Blog API', true, [v1, v2])

const tree: PageTree.Root = {
  name: 'Portal de APIs',
  children: [docs, folder('API Store', undefined, [petstore, blog])],
}

const versions: Record<string, string> = {
  '/api-store/petstore/pet': '1.0.19',
  '/api-store/blog/v1/posts': '1.0.0',
  '/api-store/blog/v2/posts': '2.0.0',
}
const getVersion = (url: string) => versions[url]

describe('getVersionTabs', () => {
  it('returns one tab per version folder, titled with its version', () => {
    expect(
      getVersionTabs(tree, getVersion).map(({ title, url, $folder }) => ({
        title,
        url,
        $folder,
      })),
    ).toEqual([
      { title: '1.0.19', url: '/api-store/petstore/pet', $folder: petstore },
      { title: '1.0.0', url: '/api-store/blog/v1/posts', $folder: v1 },
      { title: '2.0.0', url: '/api-store/blog/v2/posts', $folder: v2 },
    ])
  })

  it('skips folders whose first page has no version', () => {
    expect(getVersionTabs(tree, () => undefined)).toEqual([])
  })
})
