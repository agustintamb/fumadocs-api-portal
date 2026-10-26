import Image from 'next/image'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/logo-light.svg"
            alt="Portal de APIs"
            width={120}
            height={24}
            className="dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="Portal de APIs"
            width={120}
            height={24}
            className="hidden dark:block"
          />
          <span>Portal de APIs · Fumadocs</span>
        </>
      ),
      url: '/home',
    },
    links: [
      { text: 'Inicio', url: '/home', active: 'url' },
      { text: 'Dashboard', url: '/dashboard', active: 'url' },
      { text: 'Documentación', url: '/introduction', active: 'nested-url' },
      { text: 'API Store', url: '/api-store', active: 'nested-url' },
    ],
  }
}
