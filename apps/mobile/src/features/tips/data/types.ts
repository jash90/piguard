export type ChildReaction = {
  /** Short label of the reaction type */
  label: string
  /** What the child typically says or does */
  example: string
  /** Suggested parent response */
  parentResponse: string
  /** What the parent should NOT do */
  avoid: string
}

export type ConversationScenario = {
  key: string
  label: string
  icon: string
  /** One sentence on why this category matters */
  why: string
  /** Opening line */
  opening: string
  /** Common parent pitfalls to avoid */
  pitfalls: string[]
  /** Age-appropriate framings */
  ageNotes: {
    younger: string // ~6–10
    tween: string   // ~11–13
    teen: string    // ~14–17
  }
  /** How kids typically react and how to respond */
  reactions: ChildReaction[]
  /** Observable warning signs */
  redFlags: string[]
  /** Short-term follow-up (24–72h) */
  followUp: string[]
}
