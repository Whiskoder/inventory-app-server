import { join } from 'node:path'
import { DataSource } from 'typeorm'

import { envs } from '@config/plugins'
import { User } from '@modules/user/models'
import { Provider } from '@modules/provider/models'
import { Product } from '@modules/product/models'
import { Order, OrderItem } from '@modules/order/models'
import { Invoice } from '@modules/invoice/models'
import { Category } from '@modules/category/models'
import { Brand } from '@modules/brand/models'
import { Branch } from '@modules/branch/models'
import { AppLogger } from '@core/logger'

/**
 * Configuración de la fuente de datos (DataSource) de TypeORM para conectar
 * a la base de datos PostgreSQL.
 *
 * Se define la configuración de conexión, las entidades que forman el modelo
 * de datos y las migraciones.
 */
export const AppDataSource = new DataSource({
  type: 'postgres', // Tipo de base de datos.
  host: envs.DB_HOST, // Host de la base de datos.
  port: envs.DB_PORT, // Puerto de conexión.
  username: envs.DB_USER, // Usuario de la base de datos.
  password: envs.DB_PASS, // Contraseña de la base de datos.
  database: envs.DB_NAME, // Nombre de la base de datos.
  synchronize: envs.DB_SYNC, // Si debe sincronizarse automáticamente con la base de datos (no recomendado en producción).
  ssl: envs.DB_SSL, // Si debe usar SSL para la conexión.
  logging: false, // Desactiva el registro en consola de SQL generado por TypeORM.
  entities: [
    User,
    Provider,
    Product,
    Order,
    OrderItem,
    Invoice,
    Category,
    Brand,
    Branch,
  ], // Entidades que forman el modelo de datos.
  migrations: [join(__dirname, '../migrations', '*.ts')], // Rutas de las migraciones.
  subscribers: [], // No se usan suscriptores en este caso.
})

/**
 * Inicializa la fuente de datos (DataSource) y gestiona los intentos de conexión en caso de fallo.
 *
 * @param {number} maxRetries - Número máximo de intentos de reconexión en caso de error.
 * @param {number} retryDelayMs - Retardo en milisegundos entre intentos de reconexión.
 * @param {AppLogger} logger - Instancia del logger para registrar mensajes de error.
 * @throws {Error} Si no se puede establecer la conexión después de varios intentos.
 */
export async function initializeDatasource(
  maxRetries: number,
  retryDelayMs: number,
  logger: AppLogger
): Promise<void> {
  while (maxRetries > 0) {
    try {
      // Intentar inicializar la fuente de datos.
      await AppDataSource.initialize()
      return
    } catch (error) {
      // Si no se puede conectar, intentamos de nuevo hasta alcanzar el número máximo de intentos.
      if (--maxRetries === 0) {
        logger.error('Max retries reached, failed to connect to database')
        throw Error('Error connecting to database')
      } else {
        logger.error('Failed to connect database, trying again')
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs)) // Espera antes de reintentar.
      }
    }
  }
}
