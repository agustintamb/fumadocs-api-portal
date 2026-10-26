import type * as PageTree from 'fumadocs-core/page-tree'
import { describe, expect, it } from 'vitest'
import { findPageNeighbours } from '@/utils/find-page-neighbours'

function page(url: string): PageTree.Item {
  return { type: 'page', name: url, url }
}

function folder(
  name: string,
  children: PageTree.Node[],
  extra?: Partial<PageTree.Folder>,
): PageTree.Folder {
  return { type: 'folder', name, children, ...extra }
}

const intro = page('/api-store/petstore/intro')
const pet = page('/api-store/petstore/pet')
const store = page('/api-store/petstore/store')
const petstore = folder(
  'Petstore',
  [
    intro,
    folder('Pet', [page(`${pet.url}#add-pet`), page(`${pet.url}#update-pet`)], {
      index: pet,
    }),
    folder('Store', [page(`${store.url}#place-order`)], { index: store }),
  ],
  { root: 'petstore' },
)
const blog = folder('Blog', [page('/api-store/blog/posts')], { root: true })
const tree: PageTree.Root = { name: 'Portal', children: [petstore, blog] }

describe('findPageNeighbours', () => {
  it('skips the endpoint anchors of the sidebar', () => {
    expect(findPageNeighbours(tree, pet.url)).toEqual({
      previous: intro,
      next: store,
    })
  })

  it('stays within the root folder of the page', () => {
    expect(findPageNeighbours(tree, store.url)).toEqual({
      previous: pet,
      next: undefined,
    })
  })

  it('returns no neighbours for an unknown page', () => {
    expect(findPageNeighbours(tree, '/nope')).toEqual({})
  })
})
