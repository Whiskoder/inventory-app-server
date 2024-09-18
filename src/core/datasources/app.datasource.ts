import { join } from 'node:path'
import { DataSource } from 'typeorm'

import { envs } from '@config/plugins'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASS,
  database: envs.DB_NAME,
  synchronize: envs.NODE_ENV === 'development' ? true : false,
  ssl: true,
  logging: envs.NODE_ENV === 'development' ? false : false,
  entities: [join(__dirname, '../../modules/**/**/*.model.ts')],
  migrations: [join(__dirname, '../migrations', '*.ts')],
  subscribers: [],
})
