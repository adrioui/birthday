import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from './components/ui';
import {
  TransitionProvider,
  CharmProvider,
  AudioProvider,
  ProgressProvider,
  EasterEggProvider,
} from './context';

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
