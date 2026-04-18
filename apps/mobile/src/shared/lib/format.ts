/**
 * Converts a millisecond timestamp to a human-readable relative time string.
 * e.g. "3s ago", "2m ago", "1h ago", "3d ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffSecs = Math.floor(diffMs / 1000)

  if (diffSecs < 60) {
    return `${diffSecs}s ago`
  }

  const diffMins = Math.floor(diffSecs / 60)
  if (diffMins < 60) {
    return `${diffMins}m ago`
  }

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
