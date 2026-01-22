import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { ScanlineOverlay } from './components/overlays/ScanlineOverlay'
import { NoiseOverlay } from './components/overlays/NoiseOverlay'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { TransitionProvider } from './context/TransitionContext'
import { CharmProvider } from './context/CharmContext'
import { AudioProvider } from './context/AudioContext'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <TransitionProvider>
        <CharmProvider>
          <AudioProvider>
            <div className="relative min-h-dvh w-full overflow-hidden bg-periwinkle">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-light via-[#abc1ff] to-periwinkle-dark z-0" />

              {/* Global overlays */}
              <NoiseOverlay />
              <ScanlineOverlay />

              {/* Router outlet - AppLayout is rendered inside router root */}
              <main className="relative z-10 min-h-dvh">
                <RouterProvider router={router} />
              </main>
            </div>
          </AudioProvider>
        </CharmProvider>
      </TransitionProvider>
    </ErrorBoundary>
  )
}

export default App
