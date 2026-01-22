import React, { type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { CharmProvider } from '../context/CharmContext';
import { TransitionProvider } from '../context/TransitionContext';
import { AudioProvider } from '../context/AudioContext';
import { ProgressProvider } from '../context/ProgressContext';
import { type Charm } from '../types/charm';

interface RenderOptions {
  initialCharms?: Charm[];
}

export function renderWithProviders(ui: React.ReactElement, opts: RenderOptions = {}) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ProgressProvider>
        <TransitionProvider>
          <AudioProvider>
            <CharmProvider>{children}</CharmProvider>
          </AudioProvider>
        </TransitionProvider>
      </ProgressProvider>
    );
  }

  // Seed localStorage if initialCharms provided
  if (opts.initialCharms) {
    localStorage.setItem('birthday-os-charms', JSON.stringify(opts.initialCharms));
  }

  return render(ui, { wrapper: Wrapper });
}
