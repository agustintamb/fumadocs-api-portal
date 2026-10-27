'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  FullSearchTrigger,
  SearchTrigger,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger'
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch'
import { NavLink } from '@/components/NavLink'
import { SiteLogo } from '@/components/SiteLogo'
import { es } from '@/i18n/es'
import { useNavLinks } from '@/components/NavLink/NavLinksProvider'

export interface SiteHeaderProps {
  mobileTrigger: ReactNode
  className?: string
}

// Same look as Fumadocs' home header; each layout plugs it in through `slots.header`.
export function SiteHeader({ mobileTrigger, className = '' }: SiteHeaderProps) {
  const navLinks = useNavLinks()

  return (
    <header
      className={`bg-fd-background/80 sticky top-0 z-40 h-14 border-b backdrop-blur-lg ${className}`}
    >
      <div className="mx-auto flex h-full w-full max-w-(--fd-layout-width) items-center gap-6 px-4">
        <Link href="/home">
          <SiteLogo />
        </Link>
        <nav aria-label={es.nav.label} className="max-md:hidden">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ text, url, active, href = url }) => (
              <li key={url}>
                <NavLink href={href} activeUrl={url} match={active}>
                  {text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-1.5">
          <FullSearchTrigger
            hideIfDisabled
            className="w-full max-w-[240px] rounded-full ps-2.5 max-lg:hidden"
          />
          <SearchTrigger hideIfDisabled className="p-2 lg:hidden" />
          <ThemeSwitch />
          {mobileTrigger}
        </div>
      </div>
    </header>
  )
}
