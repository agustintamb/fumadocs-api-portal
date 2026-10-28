import Link from 'next/link'
import { es } from '@/i18n/es'

export function NotFoundContent() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{es.notFound.title}</h1>
      <p className="text-fd-muted-foreground">{es.notFound.description}</p>
      <Link
        href="/home"
        className="bg-fd-primary text-fd-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
      >
        {es.notFound.action}
      </Link>
    </main>
  )
}
