import { CLIENTS } from '@/data/clients'
import { es } from '@/i18n/es'

// Logos live in public/clients (from simpleicons, CC0). Plain <img> doesn't get the basePath.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export interface LogoListProps {
  hidden?: boolean
}

function LogoList({ hidden }: LogoListProps) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      data-clients-copy={hidden ? '' : undefined}
      className="flex shrink-0 items-center gap-12 pr-12"
    >
      {CLIENTS.map((client) => (
        <li key={client.slug} className="shrink-0">
          {/* Small local SVGs; next/image would add no value here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/clients/${client.slug}.svg`}
            alt={hidden ? '' : client.name}
            height={32}
            className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert"
          />
        </li>
      ))}
    </ul>
  )
}

export function ClientsCarousel() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <h2 className="text-fd-muted-foreground mb-8 text-center text-sm font-medium">
        {es.home.clientsTitle}
      </h2>
      <div className="clients-viewport">
        <div className="clients-track" data-testid="clients-track">
          <LogoList />
          <LogoList hidden />
        </div>
      </div>
    </section>
  )
}
