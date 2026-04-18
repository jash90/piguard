import { clsx } from 'clsx'

type KnownStatus = 'blocked' | 'allowed' | 'cached'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<KnownStatus, { label: string; className: string }> = {
  blocked: {
    label: 'Blocked',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  allowed: {
    label: 'Allowed',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  cached: {
    label: 'Cached',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config =
    statusConfig[status as KnownStatus] ?? {
      label: status,
      className: 'bg-gray-100 text-gray-600 border-gray-200',
    }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
