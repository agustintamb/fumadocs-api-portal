import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDashboardPage } from './useDashboardPage'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('useDashboardPage', () => {
  beforeEach(() => {
    push.mockClear()
  })

  it('shows all activity by default', () => {
    const { result } = renderHook(() => useDashboardPage())
    expect(result.current.filter).toBe('all')
    expect(result.current.activity).toHaveLength(5)
  })

  it('filters by status', () => {
    const { result } = renderHook(() => useDashboardPage())
    act(() => result.current.handleFilterChange('error'))
    expect(result.current.activity.map((a) => a.id)).toEqual([4])
    expect(result.current.isEmpty).toBe(false)
  })

  it('navigates to the api store', () => {
    const { result } = renderHook(() => useDashboardPage())
    act(() => result.current.handleBrowseApis())
    expect(push).toHaveBeenCalledWith('/api-store')
  })

  it('exposes spanish filter labels', () => {
    const { result } = renderHook(() => useDashboardPage())
    expect(result.current.filterOptions.map((o) => o.label)).toEqual([
      'Todas',
      'Éxito',
      'Error',
      'Pendiente',
    ])
  })
})
