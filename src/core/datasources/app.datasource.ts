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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASS,
  database: envs.DB_NAME,
  synchronize: envs.DB_SYNC,
  ssl: envs.DB_SSL,
  logging: false,
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
  ],
  migrations: [join(__dirname, '../migrations', '*.ts')],
  subscribers: [],
})

export async function initializeDatasource(
  maxRetries: number,
  retryDelayMs: number,
  logger: AppLogger
): Promise<void> {
  while (maxRetries > 0) {
    try {
      await AppDataSource.initialize()
      return
    } catch (error) {
      if (--maxRetries === 0) {
        logger.error('Max retries reached, failed to connect to database')
        throw Error('Error connecting to database')
      } else {
        logger.error('Failed to connect database, trying again')
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }
  }
}
