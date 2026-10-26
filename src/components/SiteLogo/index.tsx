import { es } from '@/i18n/es'

// Placeholder logo: a circle with a gradient in the theme's primary color, plus the brand name.
export function SiteLogo() {
  return (
    <span
      role="img"
      aria-label={es.site.logoAlt}
      className="inline-flex items-center gap-2.5 font-semibold"
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <defs>
          <linearGradient id="site-logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0"
              style={{ stopColor: 'var(--color-fd-primary)', stopOpacity: 0.25 }}
            />
            <stop offset="1" style={{ stopColor: 'var(--color-fd-primary)' }} />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#site-logo-gradient)" />
      </svg>
      {es.site.brand}
    </span>
  )
}
