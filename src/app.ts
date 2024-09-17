import { AppDataSource } from '@core/datasources'
import { AppRoutes } from '@core/routes'
import { envs, JWT } from '@config/plugins'
import { Server } from '@core/server'
;(async () => {
  main()
})()

async function main() {
  try {
    // Se crea la conexión a la base de datos
    await AppDataSource.initialize()
    // Crea la instancia de jwt
    JWT.create(envs.JWT_SECRET)

    // Crea el servidor de express
    const server = new Server({
      mode: envs.NODE_ENV,
      port: envs.PORT,
      routes: AppRoutes.routes,
    })

    server.start()
  } catch (error) {
    console.log(error)
    throw Error('Error during initialization')
  }
}
