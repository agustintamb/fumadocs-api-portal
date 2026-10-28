import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { API_CATALOG, type ApiCardData } from '@/data/apis'
import { useApiStorePage } from './useApiStorePage'

const apis: ApiCardData[] = API_CATALOG.map((api) => ({
  ...api,
  version: 'v1',
  endpoints: '1',
  docsUrl: api.path,
}))

describe('useApiStorePage', () => {
  it('starts with all apis and the visibility chips', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    expect(result.current.filtered).toHaveLength(3)
    expect(result.current.visibilityOptions.map((o) => o.label)).toEqual([
      'Todas',
      'Públicas',
      'Internas',
    ])
  })

  it('reports empty state', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    act(() => result.current.handleQueryChange('zzz'))
    expect(result.current.isEmpty).toBe(true)
  })

  it('filters by visibility', () => {
    const { result } = renderHook(() => useApiStorePage(apis))
    act(() => result.current.handleVisibilityChange('internal'))
    expect(result.current.filtered.map((a) => a.id)).toEqual(['portal'])
    expect(result.current.visibility).toBe('internal')
  })
})
