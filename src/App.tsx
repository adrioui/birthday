import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { ScanlineOverlay } from './components/overlays/ScanlineOverlay'
import { NoiseOverlay } from './components/overlays/NoiseOverlay'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { TransitionProvider } from './context/TransitionContext'
import { CharmProvider } from './context/CharmContext'
import { ScreenTransition } from './components/transitions/ScreenTransition'
import { CharmModalManager } from './components/wallet/CharmModalManager'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <TransitionProvider>
        <CharmProvider>
        <div className="relative min-h-dvh w-full overflow-hidden bg-periwinkle">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-light via-[#abc1ff] to-periwinkle-dark z-0" />

          {/* Global overlays */}
          <NoiseOverlay />
          <ScanlineOverlay />

          {/* Router outlet */}
          <main className="relative z-10 min-h-dvh">
            <RouterProvider router={router} />
          </main>

          {/* Transition overlay */}
          <ScreenTransition />
          
          {/* Charm Unlock Modal */}
          <CharmModalManager />
        </div>
        </CharmProvider>
      </TransitionProvider>
    </ErrorBoundary>
  )
}

export default App
