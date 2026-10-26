import Image from 'next/image'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { NavLink } from '@/components/NavLink'
import type { NavLinkProps } from '@/components/NavLink'
import { es } from '@/i18n/es'

const NAV_LINKS: (Omit<NavLinkProps, 'children'> & { text: string })[] = [
  { text: es.nav.home, href: '/home', match: 'url' },
  { text: es.nav.dashboard, href: '/dashboard', match: 'url' },
  { text: es.nav.docs, href: '/introduction', match: 'nested-url' },
  { text: es.nav.apiStore, href: '/api-store', match: 'nested-url' },
]

export function baseOptions(): BaseLayoutProps {
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
    links: NAV_LINKS.map(({ text, ...link }) => ({
      type: 'custom',
      children: <NavLink {...link}>{text}</NavLink>,
    })),
  }
}
