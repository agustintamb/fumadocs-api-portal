import type { ApiCardData, ApiVisibility } from '@/data/apis'
import { normalizeText } from './normalize-text'

export type ApiVisibilityFilter = ApiVisibility | 'all'

export function filterApis(
  apis: ApiCardData[],
  query: string,
  visibility: ApiVisibilityFilter,
): ApiCardData[] {
  const needle = normalizeText(query)

  return apis.filter((api) => {
    if (visibility !== 'all' && api.visibility !== visibility) return false
    if (!needle) return true
    return [api.name, api.description, ...api.tags].some((text) =>
      normalizeText(text).includes(needle),
    )
  })
}
