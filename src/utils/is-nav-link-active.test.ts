import { describe, expect, it } from 'vitest'
import { isNavLinkActive } from '@/utils/is-nav-link-active'

describe('isNavLinkActive', () => {
  it('matches the exact url, ignoring a trailing slash', () => {
    expect(isNavLinkActive('/home', '/home', 'url')).toBe(true)
    expect(isNavLinkActive('/home/', '/home', 'url')).toBe(true)
  })

  it('does not match nested paths in url mode', () => {
    expect(isNavLinkActive('/dashboard/x', '/dashboard', 'url')).toBe(false)
  })

  it('matches nested paths in nested-url mode', () => {
    expect(isNavLinkActive('/api-store', '/api-store', 'nested-url')).toBe(true)
    expect(isNavLinkActive('/api-store/petstore/pets', '/api-store', 'nested-url')).toBe(
      true,
    )
  })

  it('does not match sibling paths sharing a prefix', () => {
    expect(isNavLinkActive('/api-store-extra', '/api-store', 'nested-url')).toBe(false)
    expect(isNavLinkActive('/introduction', '/api-store', 'nested-url')).toBe(false)
  })
})
