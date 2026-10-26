import { describe, expect, it } from 'vitest'
import { countOperations } from './count-operations'

describe('countOperations', () => {
  it('counts http methods across paths', () => {
    expect(
      countOperations({
        paths: { '/a': { get: {}, post: {}, parameters: [] }, '/b': { delete: {} } },
      }),
    ).toBe(3)
  })

  it('returns 0 without paths', () => {
    expect(countOperations({})).toBe(0)
  })

  it('returns 0 for non-object documents', () => {
    expect(countOperations(null)).toBe(0)
  })
})
