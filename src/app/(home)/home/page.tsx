import type { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'
import { es } from '@/i18n/es'

export const metadata: Metadata = { title: es.nav.home }

export default function Page() {
  return <HomePage />
}
