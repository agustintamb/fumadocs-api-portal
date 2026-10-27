import type { ApiEntry } from '@/data/apis'

// A page belongs to an API only below its folder: `/api-store/portal` itself is not an API page.
export function findApiByUrl(url: string, catalog: ApiEntry[]): ApiEntry | undefined {
  return catalog.find((entry) => url.startsWith(`${entry.path}/`))
}
