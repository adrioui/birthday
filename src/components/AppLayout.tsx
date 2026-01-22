import { ScreenTransition } from './transitions/ScreenTransition'
import { CharmModalManager } from './wallet/CharmModalManager'
import { SoundToggle } from './ui/SoundToggle'

export function AppLayout() {
  return (
    <>
      {/* Transition overlay */}
      <ScreenTransition />
      
      {/* Charm Unlock Modal */}
      <CharmModalManager />

      {/* Global sound control */}
      <SoundToggle />
    </>
  )
}
