import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

// Run every minute to evaluate time-based schedules
crons.interval(
  'evaluateSchedules',
  { minutes: 1 },
  internal.schedulesCron.evaluateSchedules
)

export default crons
