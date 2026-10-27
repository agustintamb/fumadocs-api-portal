'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover'
import { NavLink } from '@/components/NavLink'
import { SiteHeader } from '@/components/SiteHeader'
import { es } from '@/i18n/es'
import { useNavLinks } from '@/components/NavLink/NavLinksProvider'

export function HomeHeader() {
  const [open, setOpen] = useState(false)
  const navLinks = useNavLinks()

  return (
    <SiteHeader
      mobileTrigger={
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            aria-label={es.nav.menu}
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon-sm',
              className: 'md:hidden',
            })}
          >
            <Menu />
          </PopoverTrigger>
          {/* Closes on any link click, including the current page. */}
          <PopoverContent align="end" onClick={() => setOpen(false)}>
            <nav aria-label={es.nav.label}>
              <ul className="flex flex-col gap-3 p-2">
                {navLinks.map(({ text, url, active, href = url }) => (
                  <li key={url}>
                    <NavLink href={href} activeUrl={url} match={active}>
                      {text}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </PopoverContent>
        </Popover>
      }
    />
  )
}
