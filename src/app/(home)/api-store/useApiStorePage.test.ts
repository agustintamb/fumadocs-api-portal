import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { API_CATALOG, type ApiCardData } from '@/data/apis'
import { useApiStorePage } from './useApiStorePage'

const apis: ApiCardData[] = API_CATALOG.map((api) => ({
  ...api,
  version: 'v1',
  endpoints: '1',
}))

describe('useApiStorePage', () => {
  it('starts with all apis and the "Todas" chip first', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    expect(result.current.filtered).toHaveLength(3)
    expect(result.current.filterOptions[0]).toEqual({ value: 'all', label: 'Todas' })
    expect(result.current.filterOptions.map((o) => o.value)).toEqual([
      'all',
      'portal',
      'petstore',
      'pokeapi',
    ])
  })

  it('reports empty state', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    act(() => result.current.handleQueryChange('zzz'))
    expect(result.current.isEmpty).toBe(true)
  })

  it('filters by chip', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    act(() => result.current.handleApiFilterChange('pokeapi'))
    expect(result.current.filtered.map((a) => a.id)).toEqual(['pokeapi'])
    expect(result.current.apiFilter).toBe('pokeapi')
  })
})
