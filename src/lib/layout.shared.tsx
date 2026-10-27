import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import { NavLink } from '@/components/NavLink'
import { es } from '@/i18n/es'
import type { NavLinkMatch } from '@/utils/is-nav-link-active'

export interface NavLinkItem {
  text: string
  // The section the link highlights.
  url: string
  active: NavLinkMatch
  // Where the link points when it differs from `url`: a folder's first page (see getNavLinks).
  href?: string
}

export const NAV_LINKS: NavLinkItem[] = [
  { text: es.nav.home, url: '/home', active: 'url' },
  { text: es.nav.dashboard, url: '/dashboard', active: 'url' },
  { text: es.nav.docs, url: '/docs', active: 'nested-url' },
  { text: es.nav.apiStore, url: '/api-store', active: 'nested-url' },
]

// Same look as the links of Fumadocs' notebook sidebar.
const SIDEBAR_LINK_CLASS =
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none aria-[current=page]:bg-fd-primary/10 aria-[current=page]:text-fd-primary'

// SiteHeader draws the logo, navbar, search and theme switch. Fumadocs only gets the
// menu links, which the notebook layout shows at the top of its mobile sidebar drawer.
// Fumadocs matches the active link against its target, so links whose target is not their
// section (`/docs` -> `/docs/introduction`) render our NavLink instead.
export function baseOptions(links: NavLinkItem[]): BaseLayoutProps {
  return {
    links: links.map(({ text, url, active, href = url }): LinkItemType =>
      href === url
        ? { type: 'main', on: 'menu', text, url, active }
        : {
            type: 'custom',
            on: 'menu',
            children: (
              <NavLink
                href={href}
                activeUrl={url}
                match={active}
                className={SIDEBAR_LINK_CLASS}
              >
                {text}
              </NavLink>
            ),
          },
    ),
    themeSwitch: { enabled: false },
  }
}
