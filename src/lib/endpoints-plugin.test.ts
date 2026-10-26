import { loader } from 'fumadocs-core/source'
import type * as PageTree from 'fumadocs-core/page-tree'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { endpointsPlugin } from '@/lib/endpoints-plugin'

function openAPIPage(title: string, endpoints: [method: string, summary: string][]) {
  return {
    title,
    toc: endpoints.map(([, summary]) => ({
      depth: 2,
      title: summary,
      url: `#${summary.toLowerCase().replaceAll(' ', '-')}`,
    })),
    getOpenAPIPageProps: () => ({
      operations: endpoints.map(([method]) => ({ method, path: '/' })),
    }),
  }
}

const source = loader({
  baseUrl: '/api-store/petstore',
  plugins: [endpointsPlugin()],
  source: {
    files: [
      {
        type: 'page',
        path: 'pet.mdx',
        data: openAPIPage('Pet', [
          ['post', 'Add a new pet to the store'],
          ['put', 'Update an existing pet'],
        ]),
      },
      {
        type: 'page',
        path: 'store.mdx',
        data: openAPIPage('Store', [['put', 'Update an existing pet']]),
      },
      {
        type: 'page',
        path: 'partial.mdx',
        // One operation has no toc entry (e.g. no operationId), so verbs can't be paired safely.
        data: {
          ...openAPIPage('Partial', [['get', 'List things']]),
          toc: openAPIPage('', [
            ['get', 'List things'],
            ['post', 'Create a thing'],
          ]).toc,
        },
      },
      { type: 'page', path: 'guide.mdx', data: { title: 'Guide', toc: [] } },
    ],
  },
})

function findNode(name: string) {
  return source.getPageTree().children.find((node) => node.name === name)
}

describe('endpointsPlugin', () => {
  it('turns an OpenAPI page into a folder of endpoint links', () => {
    const pet = findNode('Pet') as PageTree.Folder

    expect(pet.type).toBe('folder')
    expect(pet.index).toMatchObject({
      type: 'page',
      name: 'Pet',
      url: '/api-store/petstore/pet',
    })
    expect(
      pet.children.map((child) => [child.type, (child as PageTree.Item).url]),
    ).toEqual([
      ['page', '/api-store/petstore/pet#add-a-new-pet-to-the-store'],
      ['page', '/api-store/petstore/pet#update-an-existing-pet'],
    ])
    expect(pet.children.map((child) => render(child.name).container.textContent)).toEqual(
      ['Add a new pet to the store POST', 'Update an existing pet PUT'],
    )
  })

  it('links each endpoint to its own page', () => {
    const store = findNode('Store') as PageTree.Folder

    expect(store.children.map((child) => (child as PageTree.Item).url)).toEqual([
      '/api-store/petstore/store#update-an-existing-pet',
    ])
  })

  it('renders no verb badges when the verbs cannot be paired with the endpoints', () => {
    const partial = findNode('Partial') as PageTree.Folder

    expect(partial.children.map((child) => (child as PageTree.Item).url)).toEqual([
      '/api-store/petstore/partial#list-things',
      '/api-store/petstore/partial#create-a-thing',
    ])
    expect(
      partial.children.map((child) => render(child.name).container.textContent),
    ).toEqual(['List things ', 'Create a thing '])
  })

  it('leaves pages without OpenAPI data as they are', () => {
    expect(findNode('Guide')).toMatchObject({
      type: 'page',
      name: 'Guide',
      url: '/api-store/petstore/guide',
    })
  })
})
