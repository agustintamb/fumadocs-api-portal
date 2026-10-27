import type { Metadata } from 'next'
import { ApiStorePage } from './ApiStorePage'
import { getApiCatalog } from '@/lib/api-catalog'
import { resolveFolderLink } from '@/lib/folder-links'
import { es } from '@/i18n/es'

export const metadata: Metadata = { title: es.nav.apiStore }

export default async function Page() {
  const apis = await getApiCatalog(resolveFolderLink)
  return <ApiStorePage apis={apis} />
}
