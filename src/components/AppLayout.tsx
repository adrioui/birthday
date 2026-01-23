import { ScreenTransition } from './transitions/ScreenTransition';
import { CharmModalManager } from './wallet/CharmModalManager';
import { PerformanceModeIndicator } from './ui/PerformanceModeIndicator';
import { EasterEggOverlay } from './EasterEggOverlay';

export function AppLayout() {
  return (
    <>
      <ScreenTransition />
      <CharmModalManager />
      <PerformanceModeIndicator />
      <EasterEggOverlay />
    </>
  );
}
