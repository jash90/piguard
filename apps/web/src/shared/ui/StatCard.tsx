import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

export type StatCardColor = 'blue' | 'red' | 'green' | 'amber' | 'default'

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  color?: StatCardColor
  loading?: boolean
}

const colorConfig: Record<
  StatCardColor,
  { value: string; iconWrap: string; border: string }
> = {
  blue: {
    value: 'text-blue-600',
    iconWrap: 'bg-blue-50 text-blue-500',
    border: 'border-blue-100',
  },
  red: {
    value: 'text-red-600',
    iconWrap: 'bg-red-50 text-red-500',
    border: 'border-red-100',
  },
  green: {
    value: 'text-emerald-600',
    iconWrap: 'bg-emerald-50 text-emerald-500',
    border: 'border-emerald-100',
  },
  amber: {
    value: 'text-amber-600',
    iconWrap: 'bg-amber-50 text-amber-500',
    border: 'border-amber-100',
  },
  default: {
    value: 'text-gray-800',
    iconWrap: 'bg-gray-50 text-gray-500',
    border: 'border-gray-200',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = 'default',
  loading = false,
}: StatCardProps) {
  const colors = colorConfig[color]

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        colors.border
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className={clsx('rounded-lg p-2', colors.iconWrap)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-9 w-28 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <p className={clsx('text-3xl font-bold tracking-tight', colors.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        )}
      </div>
    </div>
  )
}
