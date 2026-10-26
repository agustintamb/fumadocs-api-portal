export interface FilterChipsProps<T> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}

const CHIP_CLASSES: Record<'pressed' | 'idle', string> = {
  pressed: 'bg-fd-primary text-fd-primary-foreground border-fd-primary',
  idle: 'border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: FilterChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const pressed = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${CHIP_CLASSES[pressed ? 'pressed' : 'idle']}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
