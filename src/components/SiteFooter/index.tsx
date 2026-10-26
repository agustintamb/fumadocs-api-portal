import Link from 'next/link'
import { FOOTER_COLUMNS } from '@/data/footer'
import { es } from '@/i18n/es'

export function SiteFooter() {
  return (
    <footer className="border-fd-border mt-auto border-t py-10">
      <nav
        aria-label={es.footer.label}
        className="mx-auto grid max-w-3xl grid-cols-1 gap-8 px-6 sm:grid-cols-3"
      >
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-fd-muted-foreground hover:text-fd-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </footer>
  )
}
