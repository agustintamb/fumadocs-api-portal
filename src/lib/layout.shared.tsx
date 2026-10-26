import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import { es } from '@/i18n/es'
import type { NavLinkMatch } from '@/utils/is-nav-link-active'

export const NAV_LINKS: { text: string; url: string; active: NavLinkMatch }[] = [
  { text: es.nav.home, url: '/home', active: 'url' },
  { text: es.nav.dashboard, url: '/dashboard', active: 'url' },
  { text: es.nav.docs, url: '/docs', active: 'nested-url' },
  { text: es.nav.apiStore, url: '/api-store', active: 'nested-url' },
]

// SiteHeader draws the logo, navbar, search and theme switch. Fumadocs only gets the
// menu links, which the notebook layout shows at the top of its mobile sidebar drawer.
export function baseOptions(): BaseLayoutProps {
  return {
    links: NAV_LINKS.map((link): LinkItemType => ({ type: 'main', on: 'menu', ...link })),
    themeSwitch: { enabled: false },
  }
}
