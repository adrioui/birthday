import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { exposeAgentBridge } from './agent/registry';
import { NoiseOverlay } from './components/overlays/NoiseOverlay';
import { ScanlineOverlay } from './components/overlays/ScanlineOverlay';
import { AppProviders } from './AppProviders';
import './index.css';
import { router } from './router';

function App() {
  useEffect(() => {
    exposeAgentBridge();
  }, []);

  return (
    <AppProviders>
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
    </AppProviders>
  );
}

export default App;
