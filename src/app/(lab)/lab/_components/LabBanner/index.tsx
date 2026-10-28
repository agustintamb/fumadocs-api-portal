'use client'

import { X } from 'lucide-react'
import { es } from '@/i18n/es'
import { useLabBanner } from './useLabBanner'

export function LabBanner() {
  const { isVisible, dismiss } = useLabBanner()

  if (!isVisible) return null

  return (
    <>
      {/* Keeps the end of the page reachable above the fixed banner. */}
      <div className="h-16" aria-hidden />
      <div
        role="status"
        className="bg-fd-accent border-fd-border text-fd-primary fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-center gap-2 border-t px-14 text-base shadow-lg"
      >
        <strong>{es.lab.title}</strong>
        <span className="text-fd-accent-foreground max-sm:hidden">
          {es.lab.description}
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label={es.lab.close}
          className="hover:bg-fd-primary/15 focus-visible:ring-fd-ring text-fd-accent-foreground absolute end-4 rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
    </>
  )
}
