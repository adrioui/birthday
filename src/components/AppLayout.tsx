import { ScreenTransition } from './transitions/ScreenTransition'
import { CharmModalManager } from './wallet/CharmModalManager'
import { SoundToggle } from './ui/SoundToggle'
import { PerformanceModeIndicator } from './ui/PerformanceModeIndicator'
import { SessionProgress } from './progress/SessionProgress'

export function AppLayout() {
  return (
    <>
      {/* Transition overlay */}
      <ScreenTransition />

      {/* Charm Unlock Modal */}
      <CharmModalManager />

      {/* Session progress indicator */}
      <SessionProgress />

      {/* Global sound control */}
      <SoundToggle />

      {/* Performance mode indicator */}
      <PerformanceModeIndicator />
    </>
  )
}
