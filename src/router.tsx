import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { FlipPhoneScreen } from './screens/FlipPhoneScreen'
import { SMSThreadScreen } from './screens/SMSThreadScreen'
import { CamcorderScreen } from './screens/CamcorderScreen'
import { WalletScreen } from './screens/WalletScreen'
import { CharmCardTestScreen } from './screens/CharmCardTestScreen'
import { RootRoute } from './components/RootRoute'

const rootRoute = createRootRoute({
  component: RootRoute,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FlipPhoneScreen,
})

const smsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sms',
  component: SMSThreadScreen,
})

const camcorderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camcorder',
  component: CamcorderScreen,
})

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletScreen,
})

const charmCardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charm-card-test',
  component: CharmCardTestScreen,
})

const routeTree = rootRoute.addChildren([indexRoute, smsRoute, camcorderRoute, walletRoute, charmCardTestRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
