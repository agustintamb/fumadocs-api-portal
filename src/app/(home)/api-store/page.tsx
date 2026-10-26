import type { Metadata } from 'next'
import { ApiStorePage } from '@/components/pages/ApiStorePage'
import { getApiCatalog } from '@/lib/api-catalog'
import { es } from '@/i18n/es'

export const metadata: Metadata = { title: es.nav.apiStore }

export default async function Page() {
  const apis = await getApiCatalog()
  return <ApiStorePage apis={apis} />
}
