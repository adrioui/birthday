import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { TransitionProvider } from './context/TransitionContext';
import { CharmProvider } from './context/CharmContext';
import { AudioProvider } from './context/AudioContext';
import { ProgressProvider } from './context/ProgressContext';
import { EasterEggProvider } from './context/EasterEggContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <EasterEggProvider>
        <ProgressProvider>
          <TransitionProvider>
            <CharmProvider>
              <AudioProvider>{children}</AudioProvider>
            </CharmProvider>
          </TransitionProvider>
        </ProgressProvider>
      </EasterEggProvider>
    </ErrorBoundary>
  );
}
