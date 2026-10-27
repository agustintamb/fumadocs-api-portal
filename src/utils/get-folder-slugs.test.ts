import { describe, expect, it } from 'vitest'
import { getFolderSlugs } from '@/utils/get-folder-slugs'

describe('getFolderSlugs', () => {
  it('returns each ancestor folder of the pages once', () => {
    expect(
      getFolderSlugs([
        '/docs/introduction',
        '/docs/components',
        '/api-store/blog/v1/posts',
        '/api-store/blog/v2/posts',
      ]),
    ).toEqual([
      ['docs'],
      ['api-store'],
      ['api-store', 'blog'],
      ['api-store', 'blog', 'v1'],
      ['api-store', 'blog', 'v2'],
    ])
  })

  it('skips folders that are pages themselves', () => {
    expect(getFolderSlugs(['/guides', '/guides/setup'])).toEqual([])
  })

  it('skips excluded urls owned by other routes', () => {
    expect(getFolderSlugs(['/api-store/auth/auth'], ['/api-store'])).toEqual([
      ['api-store', 'auth'],
    ])
  })
})
