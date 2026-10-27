import { es } from '@/i18n/es'

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: es.footer.pages,
    links: [
      { label: es.nav.home, href: '/home' },
      { label: es.nav.dashboard, href: '/dashboard' },
      { label: es.nav.apiStore, href: '/api-store' },
    ],
  },
  {
    title: es.footer.docs,
    links: [{ label: es.footer.introduction, href: '/docs/introduction' }],
  },
  {
    title: es.footer.apis,
    links: [
      { label: 'Portal API', href: '/api-store/portal' },
      { label: 'Petstore', href: '/api-store/petstore' },
      { label: 'PokeAPI', href: '/api-store/pokeapi' },
    ],
  },
]
