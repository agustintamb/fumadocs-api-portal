import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { i18nProvider } from 'fumadocs-ui/i18n'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { translations } from '@/lib/translations'
import './global.css'

export const metadata: Metadata = {
  title: {
    default: 'Portal de APIs · Fumadocs',
    template: '%s · Portal de APIs · Fumadocs',
  },
  description:
    'Documentación interactiva de las APIs de GST: referencia, playground y ejemplos de código.',
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={i18nProvider(translations)}>{children}</RootProvider>
      </body>
    </html>
  )
}
