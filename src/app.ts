import { envs } from '@config/plugins'
import { Server } from '@core/server'
import { AppRoutes } from '@core/routes'
import { DataSource } from 'typeorm'
;(async () => {
  main()
})()

async function main() {
  // Se crea la conexión a la base de datos
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    password: envs.DB_PASS,
    database: envs.DB_NAME,
    entities: [],
    synchronize: envs.NODE_ENV === 'development',
  })

  // Crea el servidor de express
  const server = new Server({
    mode: envs.NODE_ENV,
    port: envs.PORT,
    routes: AppRoutes.routes,
  })

  server.start()
}
