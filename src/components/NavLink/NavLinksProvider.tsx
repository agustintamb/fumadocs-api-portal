'use client'

import { createContext, use, type ReactNode } from 'react'
import { NAV_LINKS, type NavLinkItem } from '@/lib/layout.shared'

// The header is a client component; the links that point to a folder's first page are resolved
// from the page tree on the server (see getNavLinks) and handed down through this context.
const NavLinksContext = createContext<NavLinkItem[]>(NAV_LINKS)

export function NavLinksProvider({
  links,
  children,
}: {
  links: NavLinkItem[]
  children: ReactNode
}) {
  return <NavLinksContext value={links}>{children}</NavLinksContext>
}

export function useNavLinks(): NavLinkItem[] {
  return use(NavLinksContext)
}
