import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';

/* eslint-disable react-refresh/only-export-components */
import { RootRoute } from './components/RootRoute';
import { RouteErrorBoundary } from './components/ui/RouteErrorBoundary';
import { STORAGE_KEYS } from './lib/storageKeys';

const FlipPhoneScreen = lazy(() =>
  import('./screens/FlipPhoneScreen').then((m) => ({ default: m.FlipPhoneScreen }))
);
const SMSThreadScreen = lazy(() =>
  import('./screens/SMSThreadScreen').then((m) => ({ default: m.SMSThreadScreen }))
);
const CamcorderScreen = lazy(() =>
  import('./screens/CamcorderScreen').then((m) => ({ default: m.CamcorderScreen }))
);
const WalletScreen = lazy(() =>
  import('./screens/WalletScreen').then((m) => ({ default: m.WalletScreen }))
);
const CharmCardTestScreen = lazy(() =>
  import('./screens/CharmCardTestScreen').then((m) => ({ default: m.CharmCardTestScreen }))
);
const CDMixMakerScreen = lazy(() =>
  import('./screens/CDMixMakerScreen').then((m) => ({ default: m.CDMixMakerScreen }))
);
const CakeSweeperScreen = lazy(() =>
  import('./screens/CakeSweeperScreen').then((m) => ({ default: m.CakeSweeperScreen }))
);
const MemorySnapshotScreen = lazy(() =>
  import('./screens/MemorySnapshotScreen').then((m) => ({ default: m.MemorySnapshotScreen }))
);
const CelebrationScreen = lazy(() =>
  import('./screens/CelebrationScreen').then((m) => ({ default: m.CelebrationScreen }))
);
const NotFoundScreen = lazy(() =>
  import('./screens/NotFoundScreen').then((m) => ({ default: m.NotFoundScreen }))
);

export const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="text-center">
      <div className="text-2xl font-bold mb-2">Loading...</div>
      <div className="text-sm text-gray-400">Preparing your experience</div>
    </div>
  </div>
);

export const withSuspense = (Component: () => ReactNode) => {
  return () => (
    <Suspense fallback={<RouteLoading />}>
      <Component />
    </Suspense>
  );
};

const rootRoute = createRootRoute({
  component: RootRoute,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <RouteErrorBoundary>
      <FlipPhoneScreen />
    </RouteErrorBoundary>
  ),
});

const smsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sms',
  component: () => (
    <RouteErrorBoundary>
      <SMSThreadScreen />
    </RouteErrorBoundary>
  ),
});

const camcorderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camcorder',
  component: () => (
    <RouteErrorBoundary>
      <CamcorderScreen />
    </RouteErrorBoundary>
  ),
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: () => (
    <RouteErrorBoundary>
      <WalletScreen />
    </RouteErrorBoundary>
  ),
});

const charmCardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charm-card-test',
  component: () => (
    <RouteErrorBoundary>
      <CharmCardTestScreen />
    </RouteErrorBoundary>
  ),
});

const cdMixMakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cd-mix-maker',
  component: () => (
    <RouteErrorBoundary>
      <CDMixMakerScreen />
    </RouteErrorBoundary>
  ),
});

const cakeSweeperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cake-sweeper',
  component: () => (
    <RouteErrorBoundary>
      <CakeSweeperScreen />
    </RouteErrorBoundary>
  ),
});

const memorySnapshotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-snapshot',
  beforeLoad: () => {
    const lastCapture = localStorage.getItem(STORAGE_KEYS.LAST_CAPTURED_PHOTO);
    if (!lastCapture) {
      throw new Error('No photo captured');
    }
  },
  component: () => (
    <RouteErrorBoundary>
      <MemorySnapshotScreen />
    </RouteErrorBoundary>
  ),
});

const celebrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/celebration',
  component: () => (
    <RouteErrorBoundary>
      <CelebrationScreen />
    </RouteErrorBoundary>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => (
    <RouteErrorBoundary>
      <NotFoundScreen />
    </RouteErrorBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  smsRoute,
  camcorderRoute,
  walletRoute,
  charmCardTestRoute,
  cdMixMakerRoute,
  cakeSweeperRoute,
  memorySnapshotRoute,
  celebrationRoute,
  notFoundRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
