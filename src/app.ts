import { AppDataSource } from '@core/datasources'
import { AppRoutes } from '@core/routes'
import { envs, JWT } from '@config/plugins'
import { Server } from '@core/server'
import { AppLogger } from './core/logger/app-logger'
;(async () => {
  main()
})()

async function main() {
  const logger = AppLogger.create('App')

  try {
    await AppDataSource.initialize()

    JWT.create(envs.JWT_SECRET)

    const server = new Server({
      port: envs.PORT,
      routes: AppRoutes.routes,
    })

    server.start()
    logger.info(`Server running on http://localhost:${envs.PORT}`)
  } catch (error) {
    logger.error(error)
    throw Error('Error during initialization')
  }
}
