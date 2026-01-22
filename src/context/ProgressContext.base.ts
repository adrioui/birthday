import { createContext } from 'react'
import type { Milestone, MilestoneId } from '../types/progress'

export interface ProgressContextValue {
  milestones: Milestone[]
  completeMilestone: (id: MilestoneId) => void
  resetProgress: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
