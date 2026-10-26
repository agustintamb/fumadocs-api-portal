import type { ApiCardData } from '@/data/apis'
import { normalizeText } from './normalize-text'

export function filterApis(
  apis: ApiCardData[],
  query: string,
  apiId: string,
): ApiCardData[] {
  const needle = normalizeText(query)

  return apis.filter((api) => {
    if (apiId !== 'all' && api.id !== apiId) return false
    if (!needle) return true
    return [api.name, api.description, ...api.tags].some((text) =>
      normalizeText(text).includes(needle),
    )
  })
}
