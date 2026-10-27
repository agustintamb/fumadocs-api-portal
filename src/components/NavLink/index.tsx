'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavLinkActive } from '@/utils/is-nav-link-active'
import type { NavLinkMatch } from '@/utils/is-nav-link-active'

export interface NavLinkProps {
  href: string
  // The section the link highlights, when it differs from `href`.
  activeUrl?: string
  match: NavLinkMatch
  className?: string
  children: string
}

// Fumadocs only sets `data-active` on link items; custom items let us expose `aria-current`.
export function NavLink({
  href,
  activeUrl = href,
  match,
  className = 'text-fd-muted-foreground hover:text-fd-accent-foreground aria-[current=page]:text-fd-primary text-sm transition-colors aria-[current=page]:font-medium',
  children,
}: NavLinkProps) {
  const active = isNavLinkActive(usePathname(), activeUrl, match)

  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={className}>
      {children}
    </Link>
  )
}
