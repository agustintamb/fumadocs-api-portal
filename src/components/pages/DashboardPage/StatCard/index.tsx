import type { Stat } from '@/data/dashboard'

export function StatCard({ label, value, detail }: Stat) {
  return (
    <div className="bg-fd-card border-fd-border rounded-lg border p-5">
      <p className="text-fd-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-fd-muted-foreground mt-1 text-xs">{detail}</p>
    </div>
  )
}
