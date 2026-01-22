import { ScreenTransition } from './transitions/ScreenTransition'
import { CharmModalManager } from './wallet/CharmModalManager'
import { SoundToggle } from './ui/SoundToggle'
import { PerformanceModeIndicator } from './ui/PerformanceModeIndicator'

export function AppLayout() {
  return (
    <>
      {/* Transition overlay */}
      <ScreenTransition />

      {/* Charm Unlock Modal */}
      <CharmModalManager />

      {/* Global sound control */}
      <SoundToggle />

      {/* Performance mode indicator */}
      <PerformanceModeIndicator />
    </>
  )
}
