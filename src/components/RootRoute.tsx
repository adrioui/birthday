import { Outlet } from '@tanstack/react-router'
import { AppLayout } from './AppLayout'

export function RootRoute() {
  return (
    <>
      <Outlet />
      <AppLayout />
    </>
  )
}
