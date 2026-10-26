import Image from 'next/image'
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import { NavLink } from '@/components/NavLink'
import { es } from '@/i18n/es'
import type { NavLinkMatch } from '@/utils/is-nav-link-active'

const NAV_LINKS: { text: string; url: string; active: NavLinkMatch }[] = [
  { text: es.nav.home, url: '/home', active: 'url' },
  { text: es.nav.dashboard, url: '/dashboard', active: 'url' },
  { text: es.nav.docs, url: '/introduction', active: 'nested-url' },
  { text: es.nav.apiStore, url: '/api-store', active: 'nested-url' },
]

// The home header renders custom nav items directly inside a `ul`; the docs header uses a `div`.
export function baseOptions(layout: 'home' | 'docs' = 'docs'): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/logo-light.svg"
            alt={es.site.logoAlt}
            width={120}
            height={24}
            className="dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt={es.site.logoAlt}
            width={120}
            height={24}
            className="hidden dark:block"
          />
          <span>{es.site.title}</span>
        </>
      ),
      url: '/home',
    },
    // Custom items expose aria-current on the desktop bar; native items close the mobile menu.
    links: [
      ...NAV_LINKS.map(({ text, url, active }): LinkItemType => {
        const link = (
          <NavLink href={url} match={active}>
            {text}
          </NavLink>
        )
        return {
          type: 'custom',
          on: 'nav',
          children: layout === 'home' ? <li className="list-none">{link}</li> : link,
        }
      }),
      ...NAV_LINKS.map((link): LinkItemType => ({ type: 'main', on: 'menu', ...link })),
    ],
  }
}
