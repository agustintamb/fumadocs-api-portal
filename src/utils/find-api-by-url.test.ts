import { expect, it } from 'vitest'
import { API_CATALOG } from '@/data/apis'
import { findApiByUrl } from './find-api-by-url'

it.each([
  ['/api-store/portal/v2/salud', 'portal'],
  ['/api-store/pokeapi/pokemon', 'pokeapi'],
  ['/api-store/portal', undefined],
  ['/api-store/portalx/a', undefined],
  ['/docs/introduction', undefined],
])('findApiByUrl(%s) is %s', (url, id) => {
  expect(findApiByUrl(url, API_CATALOG)?.id).toBe(id)
})
