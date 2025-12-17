import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      {/* ページの中身がここに描画される */}
      <Outlet />
      {/* デバッグ用のツール（本番では消える） */}
      <TanStackRouterDevtools />
    </>
  ),
})