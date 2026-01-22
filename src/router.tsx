import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { FlipPhoneScreen } from './screens/FlipPhoneScreen'
import { SMSThreadScreen } from './screens/SMSThreadScreen'
import { CamcorderScreen } from './screens/CamcorderScreen'
import { WalletScreen } from './screens/WalletScreen'
import { CharmCardTestScreen } from './screens/CharmCardTestScreen'
import { CDMixMakerScreen } from './screens/CDMixMakerScreen'
import { CakeSweeperScreen } from './screens/CakeSweeperScreen'
import { MemorySnapshotScreen } from './screens/MemorySnapshotScreen'
import { RootRoute } from './components/RootRoute'
import { RouteErrorBoundary } from './components/ui/RouteErrorBoundary'

const rootRoute = createRootRoute({
  component: RootRoute,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <RouteErrorBoundary>
      <FlipPhoneScreen />
    </RouteErrorBoundary>
  ),
})

const smsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sms',
  component: () => (
    <RouteErrorBoundary>
      <SMSThreadScreen />
    </RouteErrorBoundary>
  ),
})

const camcorderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camcorder',
  component: () => (
    <RouteErrorBoundary>
      <CamcorderScreen />
    </RouteErrorBoundary>
  ),
})

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: () => (
    <RouteErrorBoundary>
      <WalletScreen />
    </RouteErrorBoundary>
  ),
})

const charmCardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charm-card-test',
  component: () => (
    <RouteErrorBoundary>
      <CharmCardTestScreen />
    </RouteErrorBoundary>
  ),
})

const cdMixMakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cd-mix-maker',
  component: () => (
    <RouteErrorBoundary>
      <CDMixMakerScreen />
    </RouteErrorBoundary>
  ),
})

const cakeSweeperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cake-sweeper',
  component: () => (
    <RouteErrorBoundary>
      <CakeSweeperScreen />
    </RouteErrorBoundary>
  ),
})

const memorySnapshotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-snapshot',
  component: () => (
    <RouteErrorBoundary>
      <MemorySnapshotScreen />
    </RouteErrorBoundary>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute, smsRoute, camcorderRoute, walletRoute, charmCardTestRoute, cdMixMakerRoute, cakeSweeperRoute, memorySnapshotRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
