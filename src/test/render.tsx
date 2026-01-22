import React, { type PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { CharmProvider } from '../context/CharmContext'
import { TransitionProvider } from '../context/TransitionContext'
import { type Charm } from '../types/charm'

interface RenderOptions {
  initialCharms?: Charm[]
}

export function renderWithProviders(
  ui: React.ReactElement,
  opts: RenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <TransitionProvider>
        <CharmProvider>
          {children}
        </CharmProvider>
      </TransitionProvider>
    )
  }

  // Seed localStorage if initialCharms provided
  if (opts.initialCharms) {
    localStorage.setItem('birthday-os-charms', JSON.stringify(opts.initialCharms))
  }

  return render(ui, { wrapper: Wrapper })
}
