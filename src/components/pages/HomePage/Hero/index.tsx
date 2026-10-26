import Link from 'next/link'
import { es } from '@/i18n/es'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
      <p className="text-fd-primary mb-4 text-sm font-semibold tracking-wide uppercase">
        {es.home.eyebrow}
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{es.home.title}</h1>
      <p className="text-fd-muted-foreground mt-6 text-lg">{es.home.description}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/api-store"
          className="bg-fd-primary text-fd-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {es.home.primaryAction}
        </Link>
        <Link
          href="/introduction"
          className="border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {es.home.secondaryAction}
        </Link>
      </div>
    </section>
  )
}
