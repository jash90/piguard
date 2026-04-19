import i18n from '@/shared/i18n'
import { SCENARIOS_PL } from './scenarios.pl'
import { SCENARIOS_EN } from './scenarios.en'
import type { ConversationScenario } from './types'

export type { ConversationScenario, ChildReaction } from './types'
export { SCENARIOS_PL, SCENARIOS_EN }

export function getScenarios(): ConversationScenario[] {
  return i18n.language?.startsWith('pl') ? SCENARIOS_PL : SCENARIOS_EN
}

export function getScenarioByKey(key: string): ConversationScenario | undefined {
  return getScenarios().find((s) => s.key === key)
}
