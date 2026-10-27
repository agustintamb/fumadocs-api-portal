import { describe, expect, it } from 'vitest'
import { API_CATALOG, type ApiCardData } from '@/data/apis'
import { filterApis } from './filter-apis'

const apis: ApiCardData[] = API_CATALOG.map((api) => ({
  ...api,
  version: 'v1',
  endpoints: '1',
}))

describe('filterApis', () => {
  it('matches accent- and case-insensitively on description', () => {
    expect(filterApis(apis, 'CATALOGO', 'all').map((a) => a.id)).toEqual(['portal'])
  })

  it('matches tags', () => {
    expect(filterApis(apis, 'subscriptions', 'all').map((a) => a.id)).toEqual(['portal'])
  })

  it('combines chip and query', () => {
    expect(filterApis(apis, 'jwt', 'pokeapi')).toEqual([])
  })

  it('ignores surrounding spaces', () => {
    expect(filterApis(apis, '  pets ', 'all').map((a) => a.id)).toEqual(['petstore'])
  })

  it('returns everything for an empty query and the all chip', () => {
    expect(filterApis(apis, '', 'all')).toHaveLength(3)
  })
})
