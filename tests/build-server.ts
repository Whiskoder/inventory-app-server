import { AppRoutes } from '@core/routes'
import { envs } from '@config/plugins'
import { Server } from '@core/server'

export const testServer = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes,
})
