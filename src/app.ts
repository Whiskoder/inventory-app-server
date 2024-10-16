import { initializeDatasource } from '@core/datasources'
import { AppRoutes } from '@core/routes'
import { envs } from '@config/plugins'
import { Server } from '@core/server'
import { AppLogger } from '@core/logger'
;(async () => {
  main()
})()

async function main() {
  const logger = AppLogger.create('App')
  try {
    await initializeDatasource(
      envs.DB_MAX_RETRIES,
      envs.DB_RETRY_DELAY_MS,
      logger
    )

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
