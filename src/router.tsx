import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { FlipPhoneScreen } from './screens/FlipPhoneScreen';
import { SMSThreadScreen } from './screens/SMSThreadScreen';
import { CamcorderScreen } from './screens/CamcorderScreen';
import { WalletScreen } from './screens/WalletScreen';
import { CharmCardTestScreen } from './screens/CharmCardTestScreen';
import { CDMixMakerScreen } from './screens/CDMixMakerScreen';
import { CakeSweeperScreen } from './screens/CakeSweeperScreen';
import { MemorySnapshotScreen } from './screens/MemorySnapshotScreen';
import { CelebrationScreen } from './screens/CelebrationScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { RootRoute } from './components/RootRoute';
import { RouteErrorBoundary } from './components/ui/RouteErrorBoundary';
import { STORAGE_KEYS } from './lib/storageKeys';

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
