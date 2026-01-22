import { ScreenTransition } from './transitions/ScreenTransition'
import { CharmModalManager } from './wallet/CharmModalManager'

export function AppLayout() {
  return (
    <>
      {/* Transition overlay */}
      <ScreenTransition />
      
      {/* Charm Unlock Modal */}
      <CharmModalManager />
    </>
  )
}
