import { Banner } from 'fumadocs-ui/components/banner'
import { es } from '@/i18n/es'

export function LabBanner() {
  return (
    <Banner className="bg-fd-primary/10 text-fd-primary gap-2">
      <strong>{es.lab.title}</strong>
      <span className="text-fd-muted-foreground max-sm:hidden">{es.lab.description}</span>
    </Banner>
  )
}
