export type MilestoneId = 
  | 'call-answered'
  | 'gift-revealed'
  | 'photo-snapped'
  | 'charm-collected'
  | 'cd-burned'
  | 'game-played'

export interface Milestone {
  id: MilestoneId
  name: string
  completed: boolean
}

export interface SessionProgressState {
  milestones: Milestone[]
}
