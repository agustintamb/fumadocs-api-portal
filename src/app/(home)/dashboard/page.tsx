import type { Metadata } from 'next'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { es } from '@/i18n/es'

export const metadata: Metadata = { title: es.nav.dashboard }

export default function Page() {
  return <DashboardPage />
}
