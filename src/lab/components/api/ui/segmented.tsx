'use client'
import { Tabs } from '@base-ui/react/tabs'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/cn'

export const Segmented = Tabs.Root
export const SegmentedPanel = Tabs.Panel

interface SegmentedItem {
  value: string
  label: ReactNode
}

/** a pill switch with a sliding indicator, its panels go in `<SegmentedPanel />` */
export function SegmentedList({
  items,
  className,
  ...props
}: Omit<ComponentProps<typeof Tabs.List>, 'children' | 'className'> & {
  items: SegmentedItem[]
  className?: string
}) {
  return (
    <Tabs.List
      {...props}
      className={cn(
        'bg-fd-secondary relative z-0 flex items-center rounded-lg p-0.5 text-xs font-medium',
        className,
      )}
    >
      {items.map((item) => (
        <Tabs.Tab
          key={item.value}
          value={item.value}
          className="text-fd-muted-foreground hover:text-fd-accent-foreground focus-visible:ring-fd-ring data-active:text-fd-foreground inline-flex h-6 items-center gap-1.5 rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {item.label}
        </Tabs.Tab>
      ))}
      <Tabs.Indicator className="bg-fd-background ring-fd-border dark:bg-fd-accent absolute top-(--active-tab-top) left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) rounded-md shadow-sm ring-1 transition-[translate,width] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none" />
    </Tabs.List>
  )
}
