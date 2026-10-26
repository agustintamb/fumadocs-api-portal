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
    links: [{ label: es.footer.introduction, href: '/introduction' }],
  },
  {
    title: es.footer.apis,
    links: [
      { label: 'Petstore', href: '/api-store/petstore' },
      { label: 'Blog API', href: '/api-store/blog' },
      { label: 'Auth API', href: '/api-store/auth' },
    ],
  },
]
