import { internalMutation } from './_generated/server'

// Evaluate all active schedules and update block rules accordingly
export const evaluateSchedules = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date()
    const currentDay = now.getDay() // 0-6
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const schedules = await ctx.db.query('schedules').collect()
    const activeSchedules = schedules.filter((s) => s.isActive)

    for (const schedule of activeSchedules) {
      if (!schedule.daysOfWeek.includes(currentDay)) continue

      const isWithinSchedule = isTimeInRange(
        currentTime,
        schedule.startTime,
        schedule.endTime
      )

      // Find or create a block rule for this schedule's action
      // If within schedule time → ensure blocking is active
      // If outside schedule time → ensure blocking is inactive
      // (The Pi bridge will pick up changes via the /block-rules endpoint)

      // For now, just log — actual rule mutation would go here
      console.log(
        `Schedule ${schedule._id}: ${isWithinSchedule ? 'ACTIVE' : 'INACTIVE'} at ${currentTime}`
      )
    }
  },
})

function isTimeInRange(
  current: string,
  start: string,
  end: string
): boolean {
  // Handle overnight ranges (e.g., 22:00 - 06:00)
  if (start > end) {
    return current >= start || current < end
  }
  return current >= start && current < end
}
