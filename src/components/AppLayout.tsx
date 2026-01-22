import { ScreenTransition } from './transitions/ScreenTransition';
import { CharmModalManager } from './wallet/CharmModalManager';
import { SoundToggle } from './ui/SoundToggle';
import { PerformanceModeIndicator } from './ui/PerformanceModeIndicator';
import { SessionProgress } from './progress/SessionProgress';
import { EasterEggProvider } from '../context/EasterEggContext';
import { EasterEggOverlay } from './EasterEggOverlay';

export function AppLayout() {
  return (
    <EasterEggProvider>
      <ScreenTransition />
      <CharmModalManager />
      <SessionProgress />
      <SoundToggle />
      <PerformanceModeIndicator />
      <EasterEggOverlay />
    </EasterEggProvider>
  );
}
