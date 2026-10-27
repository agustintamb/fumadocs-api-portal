import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { i18nProvider } from 'fumadocs-ui/i18n'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { NavLinksProvider } from '@/components/NavLink/NavLinksProvider'
import { es } from '@/i18n/es'
import { getNavLinks } from '@/lib/folder-links'
import { translations } from '@/lib/translations'
import './global.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: {
    default: es.site.title,
    template: `%s · ${es.site.title}`,
  },
  description: es.site.description,
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={i18nProvider(translations)}
          // Fumadocs can't infer Next's basePath, so the index URL carries it explicitly.
          search={{ options: { type: 'static', api: `${basePath}/api/search` } }}
        >
          <NavLinksProvider links={getNavLinks()}>{children}</NavLinksProvider>
        </RootProvider>
      </body>
    </html>
  )
}
