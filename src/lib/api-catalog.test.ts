import { describe, expect, it, vi } from 'vitest'
import { getApiCatalog } from './api-catalog'

vi.mock('server-only', () => ({}))

describe('getApiCatalog', () => {
  it('derives versions and endpoint counts from the specs', async () => {
    const catalog = await getApiCatalog()
    expect(catalog.map((a) => [a.id, a.version, a.endpoints])).toEqual([
      ['portal', 'v1 / v2', '14 / 14'],
      ['petstore', 'v2 / v3', '20 / 19'],
      ['pokeapi', 'v2.10.0', '102'],
    ])
  })
})
