import { describe, expect, it, vi } from 'vitest'
import { getApiCatalog } from './api-catalog'

vi.mock('server-only', () => ({}))

describe('getApiCatalog', () => {
  it('derives versions and endpoint counts from the specs', async () => {
    const catalog = await getApiCatalog()
    expect(catalog.map((a) => [a.id, a.version, a.endpoints])).toEqual([
      ['petstore', 'v1.0.19', '19'],
      ['blog', 'v1 / v2', '10 / 12'],
      ['auth', 'v2.0.0', '10'],
      ['portal', 'v1.0.0', '14'],
    ])
  })
})
